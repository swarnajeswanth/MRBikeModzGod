// app/api/auth/login/route.ts
import { connectToDB } from "@/components/lib/mongodb";
import User from "@/components/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { username, password, role } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username and password are required.",
        },
        { status: 400 }
      );
    }

    await connectToDB();

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password.",
        },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password.",
        },
        { status: 401 }
      );
    }

    // Validate role if provided
    if (role && user.role !== role) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid account type selected.",
        },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          image: user.image,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: "Server error during login.",
      },
      { status: 500 }
    );
  }
}
