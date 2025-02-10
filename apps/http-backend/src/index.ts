import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-things/config";
import { middleware } from "./middleware";
import {
  CreateRoomSchema,
  SignInSchema,
  CreateUserSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello there");
});

app.post("/signup", async (req: Request, res: Response) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log(parsedData.error);
    res.json({
      message: "Incorrect Inputs 28",
    });
    return;
  }

  try {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(parsedData.data.password, salt);

    const user = await prismaClient.user.create({
      data: {
        name: parsedData.data.username, //while testing make it as username
        email: parsedData.data.email,
        password: hashedPassword,
      },
    });

    res.json({
      userId: user.id,
    });
  } catch (e) {
    res.status(401).json({
      message: "User already existed with this email",
    });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const parsedData = SignInSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.json({
        message: "Incorrect Inputs",
      });
      return;
    }

    const user = await prismaClient.user.findFirst({
      where: {
        email: parsedData.data.username,
      },
    });

    if (!user) {
      return;
    }

    const pswd = await bcrypt.compare(parsedData.data.password, user.password);

    if (!pswd) {
      return;
    }

    const token = jwt.sign(
      {
        userId: user?.id,
      },
      JWT_SECRET
    );

    res.json({
      token,
    });
  } catch (e) {
    res.status(401).json({
      message: "error in signin",
    });
  }
});

app.post("/room", middleware, async (req, res) => {
  try {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.json({
        message: "Incorrect Inputs",
      });
      return;
    }

    //@ts-ignore
    const userId = req.userId;

    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.room_name,
        adminId: userId,
      },
    });
    res.json({
      roomId: room.id,
    });
  } catch (e) {
    console.log(e)
    res.status(411).json({
      message: "ROOM ALREADY EXISTS",
    });
  }
});

app.listen(PORT, ()=> {
  console.log(`YOUR SERVER IS RUNNING ON THE ${PORT}`);
});
