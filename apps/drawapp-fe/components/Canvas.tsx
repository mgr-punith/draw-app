import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "@/hook/useWindowSize";
import { IconButton } from "./IconButton";
import {
  Circle,
  MousePointer,
  PencilIcon,
  RectangleHorizontalIcon,
  Eraser,
  RotateCcw,
  RotateCw,
  ZoomOut,
} from "lucide-react";
import { Game } from "@/app/draw/Game";

export type Tool = "circle" | "rect" | "pencil" | "pointer" | "eraser";

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

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const lastPanRef = useRef({ x: 0, y: 0 });

  // Initialize or update canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;

      if (!gameRef.current) {
        gameRef.current = new Game(canvas, roomId, socket);
      }

      // Provide scale and offset to game instance
      gameRef.current.setTransform(scale, offset);
      gameRef.current.clearCanvas();
    }
  }, [width, height, roomId, socket, scale, offset]);

  // Update tool
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.setTool(activeTool);
    }
  }, [activeTool]);

  // Handle zooming
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      const newScale = Math.min(Math.max(0.2, scale + delta), 5);
      setScale(newScale);
    };

    canvas.addEventListener("wheel", handleWheel);
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [scale]);

  // Handle panning
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (activeTool !== "pointer") return;
      isPanningRef.current = true;
      lastPanRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanningRef.current) return;
      const dx = e.clientX - lastPanRef.current.x;
      const dy = e.clientY - lastPanRef.current.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPanRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isPanningRef.current = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeTool]);

  // Sync transform with Game class
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.setTransform(scale, offset);
    }
  }, [scale, offset]);

  return (
    <div className="relative min-h-screen w-screen">
      <div className="absolute top-20 left-12 transform -translate-x-1/2 px-2 rounded-md z-10 bg-neutral-700 mt-15">
        <TopBar activeTool={activeTool} setActiveTool={setActiveTool} />
      </div>

      <canvas
        ref={canvasRef}
        className={` block ${activeTool === "pointer" ? "cursor-grab" : "cursor-crosshair"}`}
      />

      <div className="absolute top-20 right-8 rounded-md z-20 space-x-2 bg-neutral-700 flex items-center p-2">
        <IconButton
          icon={<RotateCcw size={16} />}
          onClick={() => gameRef.current?.undo()}
          activated={false}
        />
        <IconButton
          icon={<RotateCw size={16} />}
          onClick={() => gameRef.current?.redo()}
          activated={false}
        />
        <IconButton
          icon={<ZoomOut size={16} />}
          onClick={() => {
            setScale(1);
            setOffset({ x: 0, y: 0 });
          }}
          activated={false}
        />
      </div>
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
    <div className="flex flex-col py-2">
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
      <IconButton
        activated={activeTool === "eraser"}
        icon={<Eraser size={16} />}
        onClick={() => setActiveTool("eraser")}
      />
    </div>
  );
}
