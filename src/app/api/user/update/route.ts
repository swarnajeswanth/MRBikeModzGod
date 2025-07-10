import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import User from "@/components/models/User";

export async function PUT(req: NextRequest) {
  try {
    await connectToDB();
    const { userId, updates } = await req.json();
    if (!userId || !updates || typeof updates !== "object") {
      return NextResponse.json(
        { success: false, message: "userId and updates object are required." },
        { status: 400 }
      );
    }
    // Prevent updating password or role here
    if ("password" in updates || "role" in updates) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot update password or role via this endpoint.",
        },
        { status: 400 }
      );
    }
    // If updating username, check for conflicts
    if (updates.username) {
      const existing = await User.findOne({
        username: updates.username.toLowerCase(),
      });
      if (existing && existing._id.toString() !== userId) {
        return NextResponse.json(
          {
            success: false,
            message: "This email is already in use by another user.",
          },
          { status: 409 }
        );
      }
      updates.username = updates.username.toLowerCase();
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true, select: "-password" }
    );
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user." },
      { status: 500 }
    );
  }
}
