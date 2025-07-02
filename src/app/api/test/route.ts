// src/app/api/test-mongo/route.ts
import dbConnect from "@/components/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ success: true, message: "MongoDB connected!" });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to connect to MongoDB",
      error: (error as Error).message,
    });
  }
}
