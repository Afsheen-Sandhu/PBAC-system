import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongo/mongo";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const data = await req.json();
    const { name, email, password } = data;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email and password required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Signup Error:', error.message, error.stack);
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      console.error('Signup Error:', error);
      return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
  }
}
