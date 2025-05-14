import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-things/config";
import { AuthenticatedRequest, middleware } from "./middleware";
import {
  CreateRoomSchema,
  SignInSchema,
  CreateUserSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 5001;

app.use(express.json());
app.use(cors());


app.post("/api/v1/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log(parsedData.error);
    res.json({
      success: false,
      message: "Incorrect Inputs",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
  try {
    const user = await prismaClient.user.create({
      data: {
        name: parsedData.data.username, //while testing make it as username
        email: parsedData.data?.email,
        password: hashedPassword,
      },
    });

    res.json({
      success: "true",
      message: "user created successfully",
      userId: user.id,
    });
  } catch (e) {
    res.status(401).json({
      message: "User already existed with this email or username",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  try {
    const parsedData = SignInSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.json({
        success: false,
        message: "Incorrect Inputs",
      });
      return;
    }

    const user = await prismaClient.user.findFirst({
      where: {
        email: parsedData.data.email,
      },
    });

    if (!user) {
      res.status(403).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }

    const pswd = await bcrypt.compare(parsedData.data.password, user.password);

    if (!pswd) {
      res.status(403).json({
        success: false,
        message: "Not authorized - password incorrect",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user?.id,
      },
      JWT_SECRET
    );

    res.json({
      success: true,
      message: "Login Successfully",
      token,
    });
  } catch (e) {
    res.status(401).json({
      message: "error in signin",
    });
  }
});

app.post(
  "/api/v1/room",
  middleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.json({
        success: false,
        message: "Incorrect Inputs",
      });
      return;
    }

    //@ts-ignore
    const userId = req.userId;
    if (!userId) {
      res.status(403).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }

    try {
      const room = await prismaClient.room.create({
        data: {
          slug: parsedData.data.name,
          adminId: userId,
        },
      });
      res.json({
        success: true,
        roomId: room.id,
        message: "Room has been created",
      });
    } catch (e) {
      console.log(e);
      res.status(411).json({
        message: "ROOM ALREADY EXISTS WITH THIS NAME",
      });
    }
  }
);

app.get("api/v1/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    console.log(req.params.roomId);
    const message = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });
    res.json({
      message,
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: [],
    });
  }
});

app.get("/api/v1/room/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
      where: {
        slug,
      },
    });

    res.json({
      room,
    });
  } catch (e) {
    res.json({
      message: "The Error is in /room/:slug ",
    });
  }
});

app.listen(PORT, () => {
  console.log(`YOUR SERVER IS RUNNING ON THE ${PORT}`);
});
