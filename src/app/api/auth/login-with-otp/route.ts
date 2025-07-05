import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import User from "@/components/models/User";
import OTP from "@/components/models/OTP";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { username, password, otp } = await req.json();

    if (!username || !password || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Username, password, and OTP are required.",
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

    // Verify OTP
    const otpRecord = await OTP.findOne({
      email: username.toLowerCase(),
      otp,
      role: user.role,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired OTP.",
        },
        { status: 401 }
      );
    }

    // Mark OTP as used
    await OTP.findByIdAndUpdate(otpRecord._id, { isUsed: true });

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
  } catch (error) {
    console.error("❌ Login with OTP error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error during login.",
      },
      { status: 500 }
    );
  }
}
