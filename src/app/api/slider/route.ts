import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import SliderImage from "@/components/models/SliderImage";

export const runtime = "nodejs";

// GET all slider images
export async function GET() {
  try {
    await connectToDB();
    const images = await SliderImage.find({}).sort({ order: 1, createdAt: -1 });

    console.log(`Fetched ${images.length} slider images from database`);

    return NextResponse.json({
      success: true,
      images: images,
    });
  } catch (error) {
    console.error("Error fetching slider images:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch slider images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
