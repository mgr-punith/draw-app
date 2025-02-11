import { WebSocketServer } from "ws";
import WebSocket from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-things/config";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  userId: string;
  rooms: string[];
  ws: WebSocket;
}

let users: User[] = [];
// let rooms: string[] = []

function userChecker(token: string): string | null {
  try{
    const decode = jwt.verify(token, JWT_SECRET);

  if (typeof decode == "string") {
    return null;
  }

  if (!decode || !decode.userId) {
    return null;
  }

  return decode.userId;
  }
  catch(e){
    return null;
  }
  return null
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = userChecker(token);

  if (userId === null) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message", function message(data) {
    const parsedData = JSON.parse(data as unknown as string); //the data will be like = {type : "join_room", id: 1}

    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter((x) => x === parsedData.room);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId,
            })
          );
        }
      });
    }
  });
});
