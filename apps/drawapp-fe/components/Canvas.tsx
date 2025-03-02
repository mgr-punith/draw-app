import { draw } from "@/app/draw";
import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "@/hook/useWindowSize";
import { IconButton } from "./IconButton";
import {
  Circle,
  MousePointer,
  PencilIcon,
  RectangleHorizontalIcon,
} from "lucide-react";

type Tools = "circle" | "rect" | "pencli" | "pointer";

export function Canvas({
  roomId,
  socket,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useWindowSize();
  const [activeTool, setActiveTool] = useState<Tools>("rect");

  useEffect(()=>{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.activeTool = activeTool;
  },[activeTool])

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // to => Save current canvas content
      const prevCanvasImage = ctx?.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // to => Resize the canvas
      canvas.width = width;
      canvas.height = height;

      // => Restore previous drawings
      if (prevCanvasImage) {
        ctx?.putImageData(prevCanvasImage, 0, 0);
      }

      // to => re render the drawing logic
      draw(canvas, roomId, socket);
    }
  }, [width, height]); // Runs when window size changes

  return (
    <div className="relative min-h-screen w-screen">
      {/* Floating Buttons  logic*/}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-3 rounded-lg z-10 bg-neutral-700">
        <TopBar activeTool={activeTool} setActiveTool={setActiveTool} />
      </div>

      <canvas className="bg-zinc-950 block" ref={canvasRef} />
    </div>
  );
}

function TopBar({
  activeTool,
  setActiveTool,
}: {
  activeTool: Tools;
  setActiveTool: (t: Tools) => void;
}) {
  return (
    <div className="flex flex-row py-2">
      <IconButton
        activated={activeTool === "pencli"}
        icon={<PencilIcon size={16} />}
        onClick={() => {
          setActiveTool("pencli");
        }}
      ></IconButton>
      <IconButton
        activated={activeTool === "rect"}
        icon={<RectangleHorizontalIcon size={16} />}
        onClick={() => {
          setActiveTool("rect");
        }}
      ></IconButton>
      <IconButton
        activated={activeTool === "circle"}
        icon={<Circle size={16} />}
        onClick={() => {
          setActiveTool("circle");
        }}
      ></IconButton>
      <IconButton
        activated={activeTool === "pointer"}
        icon={<MousePointer size={16} />}
        onClick={() => {
          setActiveTool("pointer");
        }}
      />
    </div>
  );
}
