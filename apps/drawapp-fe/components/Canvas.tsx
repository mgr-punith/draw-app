import { draw } from "@/app/draw";
import { useEffect, useRef } from "react";

export function Canvas({
  roomId,
  socket,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      draw(canvasRef.current, roomId, socket);
    }
  }, [canvasRef]);

  return (
    <div className="relative min-h-screen w-screen">
      {/* Floating Buttons */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        <button className="bg-white text-black px-4 py-2 rounded-lg shadow hover:font-bold">
          Rect
        </button>
        <button className="bg-white text-black px-4 py-2 rounded-lg shadow hover:font-bold">
          Circle
        </button>
      </div>

      {/* Canvas */}
      <canvas
        className="bg-zinc-950 block"
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
}
