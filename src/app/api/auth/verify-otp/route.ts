import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import OTP from "@/components/models/OTP";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, role } = await req.json();

    // Validate input
    if (!email || !otp || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, OTP, and role are required.",
        },
        { status: 400 }
      );
    }

    await connectToDB();

    // Find the OTP record (not used, not expired)
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      role,
    });

    if (!otpRecord) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No OTP found for this email and role. Please request a new code.",
        },
        { status: 404 }
      );
    }

    if (otpRecord.isUsed) {
      return NextResponse.json(
        {
          success: false,
          message: "This OTP has already been used. Please request a new code.",
        },
        { status: 400 }
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "This OTP has expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    if (otpRecord.otp !== otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect OTP. Please check the code and try again.",
        },
        { status: 400 }
      );
    }

    // Don't mark OTP as used here - it will be marked as used during signup
    // await OTP.findByIdAndUpdate(otpRecord._id, { isUsed: true });

    console.log(`✅ OTP verified for ${email} (${role})`);

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully.",
        data: {
          email,
          role,
          verified: true,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Verify OTP Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify code. Please try again.",
      },
      { status: 500 }
    );
  }
}
