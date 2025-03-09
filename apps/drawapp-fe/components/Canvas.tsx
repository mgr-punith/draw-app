import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "@/hook/useWindowSize";
import { IconButton } from "./IconButton";
import {
  Circle,
  MousePointer,
  PencilIcon,
  RectangleHorizontalIcon,
} from "lucide-react";
import { Game } from "@/app/draw/Game";

export type Tool = "circle" | "rect" | "pencil" | "pointer"; // Tool type defined here

export function Canvas({
  roomId,
  socket,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useWindowSize();
  const [activeTool, setActiveTool] = useState<Tool>("rect");
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;

      if (!gameRef.current) {
        gameRef.current = new Game(canvas, roomId, socket);
      } else {
        gameRef.current.clearCanvas();
      }
    }
  }, [width, height, roomId, socket]);

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.setTool(activeTool);
    }
  }, [activeTool]);

  return (
    <div className="relative min-h-screen w-screen">
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
  activeTool: Tool;
  setActiveTool: (t: Tool) => void;
}) {
  return (
    <div className="flex flex-row py-2">
      <IconButton
        activated={activeTool === "pencil"}
        icon={<PencilIcon size={16} />}
        onClick={() => setActiveTool("pencil")}
      />
      <IconButton
        activated={activeTool === "rect"}
        icon={<RectangleHorizontalIcon size={16} />}
        onClick={() => setActiveTool("rect")}
      />
      <IconButton
        activated={activeTool === "circle"}
        icon={<Circle size={16} />}
        onClick={() => setActiveTool("circle")}
      />
      <IconButton
        activated={activeTool === "pointer"}
        icon={<MousePointer size={16} />}
        onClick={() => setActiveTool("pointer")}
      />
    </div>
  );
}