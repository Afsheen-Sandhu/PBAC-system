"use server";
import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongo/mongo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function login(email: string, password: string) { 
    await connectToDB();
    const user = await User.findOne({ email }).populate("role").populate("permissions");
    if (!user) {
        return { error: "Invalid email or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return { error: "Invalid email or password" };
    }

    const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  
    );


    return {
        message: "Login successful",
        token,
         user: JSON.parse(JSON.stringify(user)),};
}