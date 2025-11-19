import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongo/mongo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const data = await req.json();
    const { email, password } = data;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    // Prepare payload for JWT
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };

    const secret = process.env.JWT_SECRET || "default_dummy_secret";
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    const { password: _, ...userData } = user.toObject();
    return NextResponse.json(
      { message: "Login successful", user: userData, token },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Login Error:', error.message, error.stack);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Login Error:', error);
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
  }
}
