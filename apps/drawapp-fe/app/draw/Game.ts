import { Tool } from "@/components/Canvas";
import { getAllShapes } from "./httt";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "pencil";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShape: Shape[];
  private roomId: string;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private activeTool: Tool = "circle";
  socket: WebSocket;

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

  setTool(tool: "circle" | "rect" | "pencil") {
    this.activeTool = tool;
  }

  async init() {
    this.existingShape = await getAllShapes(this.roomId);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type == "chat") {
        const parsedShape = JSON.parse(message.message);

        this.existingShape.push(parsedShape.shape);
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "black"; // Or whatever background color you want
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShape.map((shape) => {
      if (shape.type === "rect") {
        this.ctx.strokeStyle = "rgba(255,255,255)";
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.strokeStyle = "rgba(255,255,255)";
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
      }
    });
  }
  getCanvasCoordinates(event: MouseEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", (e) => {
      this.clicked = true;
      const coords = this.getCanvasCoordinates(e, this.canvas);
      this.startX = coords.x;
      this.startY = coords.y;
    });

    this.canvas.addEventListener("mouseup", (e) => {
      this.clicked = false;
      const coords = this.getCanvasCoordinates(e, this.canvas);
      const endX = coords.x;
      const endY = coords.y;

      const width = endX - this.startX;
      const height = endY - this.startY;

      const activeTool = this.activeTool;
      let shape: Shape | null = null;
      if (activeTool === "rect") {
        shape = {
          type: "rect",
          x: this.startX,
          y: this.startY,
          height,
          width,
        };
      } else if (activeTool === "circle") {
        const radius = Math.sqrt(width * width + height * height) / 2;
        shape = {
          type: "circle",
          radius: radius,
          centerX: this.startX + width / 2,
          centerY: this.startY + height / 2,
        };
      }

      if (!shape) {
        return;
      }
      this.existingShape.push(shape);

      this.socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({
            shape,
          }),
          roomId: this.roomId,
        })
      );
      this.clearCanvas();
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.clicked) {
        const coords = this.getCanvasCoordinates(e, this.canvas);
        const endX = coords.x;
        const endY = coords.y;
        const width = endX - this.startX;
        const height = endY - this.startY;
        this.clearCanvas();
        this.ctx.strokeStyle = "rgba(255, 255, 255)";

        const activeTool = this.activeTool;
        if (activeTool === "rect") {
          this.ctx.strokeRect(this.startX, this.startY, width, height);
        } else if (activeTool === "circle") {
          const radius = Math.sqrt(width * width + height * height) / 2;
          const centerX = this.startX + width / 2;
          const centerY = this.startY + height / 2;
          this.ctx.beginPath();
          this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.closePath();
        }
        this.existingShape.map((shape) => {
          if (shape.type === "rect") {
            this.ctx.strokeStyle = "rgba(255,255,255)";
            this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
          } else if (shape.type === "circle") {
            this.ctx.strokeStyle = "rgba(255,255,255)";
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
          }
        });
      }
    });
  }
}