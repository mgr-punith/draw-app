"use client";

import { useEffect, useRef } from "react";

export default function canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return;
      }

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
        // console.log(e.clientX);
        // console.log(e.clientY);
      });

      canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
          const width = e.clientX - startX;
          const height = e.clientY - startY;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeRect(startX, startY, width, height);
        }
      });
    }
  }, [canvasRef]);

  return (
    <div className="flex flex-col justify-start min-h-screen items-start">
      <div className="h-[705px] w-[705px]">
        <canvas
          style={{ backgroundColor: "white" }}
          ref={canvasRef}
          width={700}
          height={700}
        />
      </div>
    </div>
  );
}
