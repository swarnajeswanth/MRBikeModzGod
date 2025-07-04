// app/api/auth/signup/route.ts

import { connectToDB } from "@/components/lib/mongodb";
import User from "@/components/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, role, image, phoneNumber, dateOfBirth } = body;

    console.log("Incoming signup request:", { username, role });

    if (!username || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Username, password, and role are required.",
        },
        { status: 400 }
      );
    }

    await connectToDB();
    console.log("✅ Connected to MongoDB");

    const userExists = await User.findOne({ username });
    if (userExists) {
      console.warn("⚠️ Username already exists");
      return NextResponse.json(
        {
          success: false,
          message: "Username already taken.",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Password hashed");

    const newUser = await User.create({
      username,
      password: hashedPassword,
      role,
      image: image || "", // Optional defaults
      phoneNumber: phoneNumber || "",
      dateOfBirth: dateOfBirth || "",
    });

    console.log("✅ User created with ID:", newUser._id);

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully!",
        userId: newUser._id,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("❌ Signup Error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Server error during signup.",
      },
      { status: 500 }
    );
  }
}
