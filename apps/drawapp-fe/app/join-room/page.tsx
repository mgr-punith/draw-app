"use client";

import { Button } from "../../../../packages/ui/src/button";
import { Input } from "../../../../packages/ui/src/input";
import { Label } from "../../../../packages/ui/src/label";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import { toast } from "sonner";

export default function JoinRoom() {
  const [roomId, setRoomId] = useState<string>("");
  const router = useRouter();
  function createRoom(){
    router.push(`/create-room`);
  }
  function handleRoomJoin() {
    if (!roomId) {
      toast.error("RoomID is Required", {
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }

    if (!/^\d+$/.test(roomId)) {
      toast.error("RoomId must be number", {
        position: "bottom-right",
        duration: 3000,
      });
    }
    router.push(`canvas/${roomId}`);
  }
  return (
    <section className="px-4 relative overflow-hidden min-w-full">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] opacity-30 dark:opacity-20 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-screen bg-transparent flex flex-col justify-center py-12 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sm:mx-auto sm:w-full sm:max-w-md"
        >
          <h2 className="mt-4 text-center text-4xl font-bold tracking-tight text-indigo-600 mb-12">
            {"JOIN WITH ROOM-id"}
          </h2>

          <div>
            <Label htmlFor="roomId" className="text-gray-600 font-bold">
              RoomId
            </Label>
            <div className="mt-2">
              <Input
                id="roomId"
                name="roomId"
                type="text"
                autoComplete="roomId"
                placeholder="Enter you room id"
                required
                value={roomId}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setRoomId(e.target.value)
                }
                className=""
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full mt-4  flex justify-center items-center gap-2  dark:bg-black text-white bg-gray-800"
            onClick={handleRoomJoin}
          >
            Join room
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="mt-12 text-gray-700  text-md hover:text-blue-600">
            <p>Wanna create room?</p>
            <button onClick={createRoom} className="text-white">Create Room</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
