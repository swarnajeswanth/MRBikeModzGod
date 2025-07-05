import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import OTP from "@/components/models/OTP";
import {
  sendOTPEmail,
  generateOTP,
  isValidEmail,
} from "@/components/lib/emailUtils";

export async function POST(req: NextRequest) {
  try {
    const { email, role } = await req.json();

    // Validate input
    if (!email || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and role are required.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    if (!["customer", "retailer"].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role. Must be 'customer' or 'retailer'.",
        },
        { status: 400 }
      );
    }

    await connectToDB();

    // Check if user already exists
    const { default: User } = await import("@/components/models/User");
    const existingUser = await User.findOne({ username: email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    // Check for existing valid OTP
    const existingOTP = await OTP.findOne({
      email,
      role,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (existingOTP) {
      // Optionally, resend the same OTP via email
      await sendOTPEmail({ to: email, otp: existingOTP.otp, role });
      return NextResponse.json(
        {
          success: true,
          message:
            "A verification code has already been sent to your email. Please use the existing code.",
        },
        { status: 200 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing (expired/used) OTPs for this email and role
    await OTP.deleteMany({ email, role });

    // Save new OTP
    await OTP.create({
      email,
      otp,
      role,
      expiresAt,
      isUsed: false,
    });

    // Send OTP email
    const emailSent = await sendOTPEmail({
      to: email,
      otp,
      role,
    });

    if (!emailSent) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send verification email. Please try again.",
        },
        { status: 500 }
      );
    }

    console.log(`✅ OTP sent to ${email} for ${role} registration`);

    return NextResponse.json(
      {
        success: true,
        message: "Verification code sent to your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Send OTP Error:", error);
    let message = "Failed to send verification code. Please try again.";
    if (error instanceof Error && error.message) {
      message += ` Details: ${error.message}`;
    }
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
