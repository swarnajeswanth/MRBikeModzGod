import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import User from "@/components/models/User";

export async function PUT(req: NextRequest) {
  try {
    const { userId, requireOTPOnLogin } = await req.json();

    if (!userId || typeof requireOTPOnLogin !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "User ID and OTP preference are required.",
        },
        { status: 400 }
      );
    }

    await connectToDB();

    // Find the user and verify they are a retailer
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    if (user.role !== "retailer") {
      return NextResponse.json(
        {
          success: false,
          message: "Only retailers can update OTP preferences.",
        },
        { status: 403 }
      );
    }

    // Update the OTP preference
    user.requireOTPOnLogin = requireOTPOnLogin;
    await user.save();

    console.log(
      `✅ OTP preference updated for ${user.username}: ${requireOTPOnLogin}`
    );

    return NextResponse.json(
      {
        success: true,
        message: `OTP on login ${
          requireOTPOnLogin ? "enabled" : "disabled"
        } successfully.`,
        requireOTPOnLogin,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Update OTP preference error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while updating OTP preference.",
      },
      { status: 500 }
    );
  }
}
