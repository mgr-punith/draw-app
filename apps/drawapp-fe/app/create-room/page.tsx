"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../../packages/ui/src/button";
import { Input } from "../../../../packages/ui/src/input";
import { Label } from "../../../../packages/ui/src/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@repo/ui/select";
import axios from "axios";
import { BCK_API } from "@/config";
import { getVerifiedToken } from "@/lib/cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getVerifiedToken();

    if (!token) {
      toast.error("TOKEN IS MISSING", {
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }

    try {
      const res = await axios.post(
        `${BCK_API}/room`,
        { name: roomName },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message, {
          position: "bottom-right",
          duration: 3000,
        });
        if (!res.data.roomId) {
          console.error("Room ID is missing from response:", res.data);
          toast.error("Room ID is missing.");
          return;
        }
        router.push(`/canvas/${res.data.roomId}`);
      } else {
        toast.error(res.data.message, {
          position: "bottom-right",
          duration: 3000,
        });
      }
    } catch (error: any) {
      toast.error("Internal Server Error: " + error.message, {
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 pt-32 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 text-indigo-600">Create a New Room</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Set up your collaborative drawing space
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-12 max-w-60">
          {/* Room Name */}
          <div>
            <Label htmlFor="room-name" className="text-gray-700">Room Name</Label>
            <div className="mt-2">
              <Input
                id="room-name"
                name="room-name"
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="max-w-40 dark:bg-black text-white bg-blue-600"
          >
            Create Room
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
