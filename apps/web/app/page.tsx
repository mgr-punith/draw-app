"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height:"100vh",
        width:"100vw",
      }}
    >
      <form>
        <input
          style={{
            padding: "10px",
          }}
          value={roomId}
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
          type="text"
          placeholder="Enter room name"
        />
        <button
        type="submit"
          style={{
            padding: "10px",
            marginLeft:"4px"
          }}
          onClick={() => {
            router.push(`/room/${roomId}`);
          }}
        >
          Join Room
        </button>
      </form>
    </div>
  );
}
