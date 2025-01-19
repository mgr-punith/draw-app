import express from "express";

const app = express();
const PORT = 5000;

app.get("/", (req, res)=>{
    res.send("hello there");
})

app.listen(PORT, ()=>{
    console.log(`YOUR SERVER IS RUNNING ON THE ${PORT}`);
});
