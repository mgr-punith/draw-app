import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-things/config";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] ?? "";
  const decode = jwt.verify(token, JWT_SECRET) as string;

  try {
    if (decode) {
      // @ts-ignore
      req.userId = decode.userId as string;
      next();
    } else {
      res.status(403).json({
        message: "Unauthorized",
      });
    }
  } catch (error) {
    res.status(403).json({ 
        message: "Unauthorized" 
    });
  }
}
