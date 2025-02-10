import { z } from "zod";

export const CreateUserSchema = z.object({
    username : z.string().min(3).max(20),
    email : z.string().min(3).max(30),
    password : z.string().min(4).max(30),
    
})

export const SignInSchema = z.object({
    username : z.string(),
    password : z.string()
})

export const CreateRoomSchema = z.object({
    room_name : z.string().min(3).max(15)
})