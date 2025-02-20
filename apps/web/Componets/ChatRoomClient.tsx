"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
  messages = [],
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const [chats, setChats] = useState<{ message: string }[]>(messages);
  const { socket, loading } = useSocket();
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    if (socket && !loading) {
      if (socket.readyState !== WebSocket.OPEN) {
        console.warn("WebSocket is not open yet. Waiting...");
        return;
      }

      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );

      const handleMessage = (event: MessageEvent) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChats((prevChats) => [
            ...prevChats,
            { message: parsedData.message },
          ]);
        }
      };

      socket.addEventListener("message", handleMessage);

      return () => {
        socket.removeEventListener("message", handleMessage);
      };
    }
  }, [socket, loading, id]);

  return (
    <div>
      <div
        style={{
          height: "500px",
          width: "500px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {chats?.map((m, index) => <div key={index}>{m.message}</div>)}
      </div>

      <input
        type="text"
        value={currentMessage}
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
      />
      <button
        onClick={() => {
          if (socket) {
            socket.send(
              JSON.stringify({
                type: "chat",
                roomId: id,
                message: currentMessage,
              })
            );
          }
          setCurrentMessage("");
        }}
      >
        SEND
      </button>
    </div>
  );
}
