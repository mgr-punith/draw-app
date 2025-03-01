import { HTTP_BACKEND } from "@/config";
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
    };

export async function draw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");
  const existingShape: Shape[] = await getAllShapes(roomId);
  console.log(existingShape);

  if (!ctx) {
    return;
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type == "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShape.push(parsedShape);
      clearCanvas(existingShape, canvas, ctx);
    }
  };

  clearCanvas(existingShape, canvas, ctx);
  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;

    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      height,
      width,
    };
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
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(existingShape, canvas, ctx);
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(startX, startY, width, height);
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

  existingShape.map((shapes) => {
    if (shapes.type === "rect") {
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(shapes.x, shapes.y, shapes.width, shapes.height);
    }
  });
}

async function getAllShapes(roomId: string) {
  try {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    // console.log("the 107 error: ", res.data.messages);
    const messages = res.data.messages;

    const shapes = messages.map((x: { message: string }) => {
      const messageData = JSON.parse(x.message);
      return messageData.shape;
    });
    return shapes;
  } catch (error) {
    console.error("Error fetching shapes:", error);
    return [];
  }
}
