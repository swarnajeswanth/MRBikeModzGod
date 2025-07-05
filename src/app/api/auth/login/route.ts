// app/api/auth/login/route.ts
import { connectToDB } from "@/components/lib/mongodb";
import User from "@/components/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { isWhitelistedRetailerEmail } from "@/components/lib/retailerConfig";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, role } = body;

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

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials.",
        },
        { status: 401 }
      );
    }

    // Check if user is trying to login with correct role
    if (role && user.role !== role) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid role. This account is registered as a ${user.role}.`,
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials.",
        },
        { status: 401 }
      );
    }

    // OTP verification requirement removed - users can login directly

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      data: {
        user: {
          id: user._id,
          username: user.username,
          image: user.image,
          role: user.role,
          dateOfBirth: user.dateOfBirth,
          phoneNumber: user.phoneNumber,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Login failed.",
      },
      { status: 500 }
    );
  }
}
