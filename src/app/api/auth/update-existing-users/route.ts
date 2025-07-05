import { connectToDB } from "@/components/lib/mongodb";
import User from "@/components/models/User";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectToDB();

    // Update all existing users to remove OTP login requirement
    const result = await User.updateMany(
      { requireOTPOnLogin: true },
      { requireOTPOnLogin: false }
    );

    console.log(
      `Updated ${result.modifiedCount} users to remove OTP login requirement`
    );

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} users to remove OTP login requirement`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating existing users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update existing users",
      },
      { status: 500 }
    );
  }
}
