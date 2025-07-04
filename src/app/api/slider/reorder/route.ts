import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import SliderImage from "@/components/models/SliderImage";

export const runtime = "nodejs";

// PUT reorder slider images
export async function PUT(request: NextRequest) {
  try {
    await connectToDB();
    const body = await request.json();
    const { imageIds } = body;

    if (!imageIds || !Array.isArray(imageIds)) {
      return NextResponse.json(
        { success: false, error: "Image IDs array is required" },
        { status: 400 }
      );
    }

    console.log("Reordering slider images:", imageIds);

    // Update order for each image
    const updatePromises = imageIds.map((imageId: string, index: number) => {
      return SliderImage.updateOne({ id: imageId }, { order: index + 1 });
    });

    await Promise.all(updatePromises);

    // Fetch updated images
    const updatedImages = await SliderImage.find({}).sort({
      order: 1,
      createdAt: -1,
    });

    console.log("Slider images reordered successfully");

    return NextResponse.json({
      success: true,
      message: "Slider images reordered successfully",
      images: updatedImages,
    });
  } catch (error) {
    console.error("Error reordering slider images:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to reorder slider images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
