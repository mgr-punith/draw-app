"use client";

import { draw } from "@/app/draw";
import { useEffect, useRef } from "react";

export default function canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      draw(canvasRef.current)
    }
  }, [canvasRef]);

  return (
    <div className="flex flex-col justify-start min-h-screen items-start">
      <div className="h-[705px] w-[705px]">
        <canvas
          className="bg-zinc-950"
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      </div>
    </div>
  );
}
