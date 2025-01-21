import express from "express";
import  jwt  from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-things/config";
import { middleware } from "./middleware";

const app = express();
const PORT = 5000;

app.get("/", (req, res)=>{
    res.send("hello there");
})

app.post("/signup", (req, res)=>{
    //DB CALLLL
    res.json({
        roomId: "123"
    })
})

app.post("/signin", (req, res)=>{
    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        token,
    })
})

app.post("/room", middleware, (req, res)=>{
    // db call here

    res.json({
        roomId:123
    })
})

app.listen(PORT, ()=>{
    console.log(`YOUR SERVER IS RUNNING ON THE ${PORT}`);
});
