import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/hash/Hash";
import User from "@/lib/models/User";
import Role from "@/lib/models/Role";
import { connectToDB } from "@/lib/mongo/mongo";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const data = await req.json();
    const { name, email, password } = data;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Please fill all the fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Assign admin role by default
    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      return NextResponse.json({ error: "Admin role not found" }, { status: 500 });
    }
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: adminRole._id,
      permissions: adminRole.permissions,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "Registration successful", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Signup Error:', error.message, error.stack);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Signup Error:', error);
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
  }
}
