"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5NTExY2ZhOS1mNjJjLTRmMTktODgyNC0yMjVmYmUzZjNiZWEiLCJpYXQiOjE3NDA1NzE0Mzl9.iyPHIILQNjM00HDEPwO_yQt39E4NUVKmdL5EGgyYQ84`
    );

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };
  });

  if (!socket) {
    return <div>Connecting to server........</div>;
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}
