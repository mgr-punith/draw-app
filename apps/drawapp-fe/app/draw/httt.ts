import { BCK_API } from "@/config";
import axios from "axios";

export async function getAllShapes(roomId: string) {
  const res = await axios.get(`${BCK_API}/chats/${roomId}`);
  const messages = res.data.message || [];

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });
  return shapes;
}
