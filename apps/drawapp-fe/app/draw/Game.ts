import { Tool } from "@/components/Canvas";
import { getAllShapes } from "./httt";

type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number }
  | { type: "pencil"; points: { x: number; y: number }[] };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShape: Shape[];
  private roomId: string;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private activeTool: Tool = "circle";
  private currentPencilPath: { x: number; y: number }[] = [];
  private hoverShapeIndex: number | null = null;
  private history: Shape[][] = [];
  private redoStack: Shape[][] = [];
  socket: WebSocket;

  private scale = 1;
  private offset = { x: 0, y: 0 };
  private isPanning = false;
  private panStart = { x: 0, y: 0 };

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShape = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  setTool(tool: Tool) {
    this.activeTool = tool;
  }
  setTransform(scale: number, offset: { x: number; y: number }) {
    this.scale = scale;
    this.offset = offset;
    this.clearCanvas();
  }

  async init() {
    this.existingShape = await getAllShapes(this.roomId);
    this.saveHistory();
    this.clearCanvas();
  }

  saveHistory() {
    this.history.push(JSON.parse(JSON.stringify(this.existingShape)));
    this.redoStack = [];
  }

  undo() {
    if (this.history.length > 1) {
      this.redoStack.push(this.history.pop()!);
      this.existingShape = [...this.history[this.history.length - 1]];
      this.clearCanvas();
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const redoState = this.redoStack.pop()!;
      this.history.push(JSON.parse(JSON.stringify(redoState)));
      this.existingShape = [...redoState];
      this.clearCanvas();
    }
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShape.push(parsedShape.shape);
        this.saveHistory();
        this.clearCanvas();
      } else if (message.type === "delete-shape") {
        const deleted = message.shape;
        this.existingShape = this.existingShape.filter(
          (shape) => JSON.stringify(shape) !== JSON.stringify(deleted)
        );
        this.saveHistory();
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    // Reset transform to clear full screen
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
    // Apply zoom and pan
    this.ctx.setTransform(
      this.scale,
      0,
      0,
      this.scale,
      this.offset.x,
      this.offset.y
    );

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShape.forEach((shape, index) => {
      this.ctx.strokeStyle =
        this.activeTool === "eraser" && index === this.hoverShapeIndex
          ? "red"
          : "white";

      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          shape.radius,
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "pencil") {
        this.ctx.beginPath();
        shape.points.forEach((point, i) => {
          if (i === 0) this.ctx.moveTo(point.x, point.y);
          else this.ctx.lineTo(point.x, point.y);
        });
        this.ctx.stroke();
        this.ctx.closePath();
      }
    });
  }

  drawCurrentPencilPath() {
    if (this.currentPencilPath.length === 0) return;
    this.ctx.beginPath();
    this.ctx.strokeStyle = "white";
    this.currentPencilPath.forEach((point, i) => {
      if (i === 0) this.ctx.moveTo(point.x, point.y);
      else this.ctx.lineTo(point.x, point.y);
    });
    this.ctx.stroke();
    this.ctx.closePath();
  }

  getCanvasCoordinates(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Invert pan + zoom transform
    return {
      x: (x - this.offset.x) / this.scale,
      y: (y - this.offset.y) / this.scale,
    };
  }

  eraseShapeAt(x: number, y: number) {
    const shapeIndex = this.existingShape.findIndex((shape) => {
      if (shape.type === "rect") {
        return (
          x >= shape.x &&
          x <= shape.x + shape.width &&
          y >= shape.y &&
          y <= shape.y + shape.height
        );
      } else if (shape.type === "circle") {
        const dx = x - shape.centerX;
        const dy = y - shape.centerY;
        return dx * dx + dy * dy <= shape.radius * shape.radius;
      } else if (shape.type === "pencil") {
        return shape.points.some(
          (point) => Math.abs(point.x - x) < 5 && Math.abs(point.y - y) < 5
        );
      }
      return false;
    });

    if (shapeIndex !== -1) {
      const deletedShape = this.existingShape[shapeIndex];
      this.existingShape.splice(shapeIndex, 1);
      this.saveHistory();
      this.socket.send(
        JSON.stringify({
          type: "delete-shape",
          shape: deletedShape,
          roomId: this.roomId,
        })
      );
      this.clearCanvas();
    }
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", (e) => {
      const coords = this.getCanvasCoordinates(e);
      if (e.button === 1 || this.activeTool === "pointer") {
        this.isPanning = true;
        this.panStart = { x: e.clientX, y: e.clientY };
        return;
      }

      this.startX = coords.x;
      this.startY = coords.y;
      this.clicked = true;

      if (this.activeTool === "eraser") {
        this.eraseShapeAt(coords.x, coords.y);
        return;
      }

      if (this.activeTool === "pencil") {
        this.currentPencilPath = [coords];
      }
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.isPanning) {
        const dx = e.clientX - this.panStart.x;
        const dy = e.clientY - this.panStart.y;
        this.panStart = { x: e.clientX, y: e.clientY };
        this.offset.x += dx;
        this.offset.y += dy;
        this.clearCanvas();
        return;
      }

      const coords = this.getCanvasCoordinates(e);
      const { x, y } = coords;

      if (this.activeTool === "eraser") {
        this.hoverShapeIndex = this.existingShape.findIndex((shape) => {
          if (shape.type === "rect") {
            return (
              x >= shape.x &&
              x <= shape.x + shape.width &&
              y >= shape.y &&
              y <= shape.y + shape.height
            );
          } else if (shape.type === "circle") {
            const dx = x - shape.centerX;
            const dy = y - shape.centerY;
            return dx * dx + dy * dy <= shape.radius * shape.radius;
          } else if (shape.type === "pencil") {
            return shape.points.some(
              (point) => Math.abs(point.x - x) < 5 && Math.abs(point.y - y) < 5
            );
          }
          return false;
        });
        this.clearCanvas();
        return;
      }

      if (this.clicked && this.activeTool === "pencil") {
        this.currentPencilPath.push(coords);
        this.clearCanvas();
        this.drawCurrentPencilPath();
        return;
      }

      if (this.clicked) {
        this.clearCanvas();
        const endX = coords.x;
        const endY = coords.y;
        const width = endX - this.startX;
        const height = endY - this.startY;
        this.ctx.strokeStyle = "white";

        if (this.activeTool === "rect") {
          this.ctx.strokeRect(this.startX, this.startY, width, height);
        } else if (this.activeTool === "circle") {
          const radius = Math.sqrt(width * width + height * height) / 2;
          const centerX = this.startX + width / 2;
          const centerY = this.startY + height / 2;
          this.ctx.beginPath();
          this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
    });

    this.canvas.addEventListener("mouseup", (e) => {
      if (this.isPanning) {
        this.isPanning = false;
        return;
      }

      const coords = this.getCanvasCoordinates(e);
      this.clicked = false;

      if (this.activeTool === "pencil") {
        this.currentPencilPath.push(coords);
        const shape: Shape = {
          type: "pencil",
          points: [...this.currentPencilPath],
        };
        this.existingShape.push(shape);
        this.saveHistory();
        this.socket.send(
          JSON.stringify({
            type: "chat",
            message: JSON.stringify({ shape }),
            roomId: this.roomId,
          })
        );
        this.clearCanvas();
        this.currentPencilPath = [];
        return;
      }

      const width = coords.x - this.startX;
      const height = coords.y - this.startY;

      let shape: Shape | null = null;
      if (this.activeTool === "rect") {
        shape = {
          type: "rect",
          x: this.startX,
          y: this.startY,
          width,
          height,
        };
      } else if (this.activeTool === "circle") {
        const radius = Math.sqrt(width * width + height * height) / 2;
        shape = {
          type: "circle",
          centerX: this.startX + width / 2,
          centerY: this.startY + height / 2,
          radius,
        };
      }

      if (shape) {
        this.existingShape.push(shape);
        this.saveHistory();
        this.socket.send(
          JSON.stringify({
            type: "chat",
            message: JSON.stringify({ shape }),
            roomId: this.roomId,
          })
        );
        this.clearCanvas();
      }
    });

    // Zoom with wheel
    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomIntensity = 0.1;
      const direction = e.deltaY > 0 ? -1 : 1;
      const factor = 1 + zoomIntensity * direction;

      const mouse = this.getCanvasCoordinates(e);
      this.offset.x -= (mouse.x * factor - mouse.x) * this.scale;
      this.offset.y -= (mouse.y * factor - mouse.y) * this.scale;
      this.scale *= factor;

      this.clearCanvas();
    });
  }
}
