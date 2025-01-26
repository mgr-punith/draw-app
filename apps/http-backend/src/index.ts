import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-things/config";
import { middleware } from "./middleware";
import {
  CreateRoomSchema,
  SignInSchema,
  CreateUserSchema,
} from "@repo/common/";
import { prisma } from "@repo/db/client";

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("hello there");
});

app.post("/signup", (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect Inputs",
    });
    return;
  }

  //DB CALLLL
  res.json({
    roomId: "123",
  });
});

app.post("/signin", (req, res) => {
  const data = SignInSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect Inputs",
    });
    return;
  }

  const userId = 1;
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    token,
  });
});

app.post("/room", middleware, (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect Inputs",
    });
    return;
  }
  
  // db call here

  res.json({
    roomId: 123,
  });
});

app.listen(PORT, () => {
  console.log(`YOUR SERVER IS RUNNING ON THE ${PORT}`);
});
