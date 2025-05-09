import { BCK_API } from "@/config";
import axios from "axios";

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

export async function draw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");
  let existingShape: Shape[] = await getAllShapes(roomId);
  console.log(existingShape);

  if (!ctx) {
    return;
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type == "chat") {
      const parsedShape = JSON.parse(message.message);

      existingShape = [...existingShape, parsedShape];
      clearCanvas(existingShape, canvas, ctx);
    }
  };

  clearCanvas(existingShape, canvas, ctx);
  let clicked = false;
  let startX = 0;
  let startY = 0;

  function getCanvasCoordinates(event: MouseEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    const coords = getCanvasCoordinates(e, canvas);
    startX = coords.x;
    startY = coords.y;
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const coords = getCanvasCoordinates(e, canvas);
    const endX = coords.x;
    const endY = coords.y;

    const width = endX - startX;
    const height = endY - startY;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const activeTool = window.activeTool;
    let shape: Shape | null = null;
    if (activeTool === "rect") {
      shape = {
        type: "rect",
        x: startX,
        y: startY,
        height,
        width,
      };
    } else if (activeTool === "circle") {
      const radius = Math.abs(Math.max(width, height) / 2);
      shape = {
        type: "circle",
        radius: radius,
        centerX: startX + width / 2,
        centerY: startY + height / 2,
      };
    }

    if (!shape) {
      return;
    }
    existingShape.push(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId,
      })
    );
    clearCanvas(existingShape, canvas, ctx);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const coords = getCanvasCoordinates(e, canvas);
      const endX = coords.x;
      const endY = coords.y;
      const width = endX - startX;
      const height = endY - startY;
      clearCanvas(existingShape, canvas, ctx);
      ctx.strokeStyle = "rgba(255, 255, 255)";

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const activeTool = window.activeTool;
      if (activeTool === "rect") {
        ctx.strokeRect(startX, startY, width, height);
      } else if (activeTool === "circle") {
        const radius = Math.abs(Math.max(width, height) / 2);
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      }
    }
  });
}

function clearCanvas(
  existingShape: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShape.map((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  });
}

export async function getAllShapes(roomId: string) {
  const res = await axios.get(`${BCK_API}/chats/${roomId}`);
  const messages = res.data.message || [];

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });
  return shapes;
}
