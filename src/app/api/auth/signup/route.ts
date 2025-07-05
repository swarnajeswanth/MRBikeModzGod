// app/api/auth/signup/route.ts

import { connectToDB } from "@/components/lib/mongodb";
import User from "@/components/models/User";
import OTP from "@/components/models/OTP";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/components/lib/emailUtils";
import { isWhitelistedRetailerEmail } from "@/components/lib/retailerConfig";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, role, otp, requireOTP = false } = body;

    console.log("Signup request received:", {
      username,
      role,
      requireOTP,
      hasOTP: !!otp,
      otpLength: otp?.length,
    });

    // Validate required fields
    if (!username || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Username, password, and role are required.",
        },
        { status: 400 }
      );
    }

    // Validate role
    if (!["customer", "retailer"].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role. Must be 'customer' or 'retailer'.",
        },
        { status: 400 }
      );
    }

    // Check if retailer email is whitelisted
    if (role === "retailer" && !isWhitelistedRetailerEmail(username)) {
      return NextResponse.json(
        {
          success: false,
          message: "This email is not authorized for retailer registration.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      username: username.toLowerCase(),
    });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists.",
        },
        { status: 409 }
      );
    }

    // Handle OTP verification for retailers
    if (role === "retailer" && requireOTP) {
      console.log("Processing retailer OTP verification...");

      if (!otp) {
        console.log("OTP missing for retailer registration");
        return NextResponse.json(
          {
            success: false,
            message: "OTP is required for retailer registration.",
          },
          { status: 400 }
        );
      }

      // Find OTP record for this email/role
      const otpRecord = await OTP.findOne({
        email: username.toLowerCase(),
        role: "retailer",
      });

      console.log("OTP record found:", {
        found: !!otpRecord,
        isUsed: otpRecord?.isUsed,
        expiresAt: otpRecord?.expiresAt,
        isExpired: otpRecord?.expiresAt < new Date(),
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
            message:
              "This OTP has already been used. Please request a new code.",
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

      // Mark OTP as used
      await OTP.findByIdAndUpdate(otpRecord._id, { isUsed: true });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    console.log("Creating user with data:", {
      username: username.toLowerCase(),
      role,
      requireOTPOnLogin: false, // OTP login requirement removed
      emailVerified: role === "retailer" ? requireOTP : true,
    });

    const user = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword,
      role,
      image: "",
      wishlist: [],
      dateOfBirth: "",
      phoneNumber: "",
      requireOTPOnLogin: false, // OTP login requirement removed
      emailVerified: role === "retailer" ? requireOTP : true,
    });

    console.log("User created successfully:", user._id);

    // Send welcome email for retailers
    if (role === "retailer") {
      try {
        await sendOTPEmail({
          to: username,
          otp: "WELCOME",
          role: "retailer",
          userName: username,
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "User registered successfully.",
      data: {
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    let errorMessage = "Failed to register user.";

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        errorMessage = "User with this email already exists.";
      } else if (error.message.includes("validation failed")) {
        errorMessage = "Invalid user data provided.";
      } else {
        errorMessage = `Registration failed: ${error.message}`;
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
