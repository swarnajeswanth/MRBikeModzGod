import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import SliderImage from "@/components/models/SliderImage";
import { deleteMultipleImagesFromImageKit } from "@/components/lib/imagekitUtils";

export const runtime = "nodejs";

// POST bulk delete slider images
export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const body = await request.json();
    const { imageIds } = body;

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "No image IDs provided" },
        { status: 400 }
      );
    }

    console.log("Bulk deleting slider images:", imageIds);

    // Find all images to be deleted
    const imagesToDelete = await SliderImage.find({ id: { $in: imageIds } });

    if (imagesToDelete.length === 0) {
      return NextResponse.json(
        { success: false, error: "No images found to delete" },
        { status: 404 }
      );
    }

    // Extract ImageKit IDs for deletion
    const imageKitIds = imagesToDelete
      .map((img) => img.imageKitId)
      .filter((id) => id) as string[];

    // Delete from ImageKit
    let imageKitDeletionResults = {
      success: [] as string[],
      failed: [] as string[],
    };
    if (imageKitIds.length > 0) {
      imageKitDeletionResults = await deleteMultipleImagesFromImageKit(
        imageKitIds
      );
    }

    // Delete from database
    const deleteResult = await SliderImage.deleteMany({
      id: { $in: imageIds },
    });

    console.log("Bulk slider images deletion completed:", {
      requested: imageIds.length,
      deleted: deleteResult.deletedCount,
      imageKitSuccess: imageKitDeletionResults.success.length,
      imageKitFailed: imageKitDeletionResults.failed.length,
    });

    return NextResponse.json({
      success: true,
      message: "Bulk deletion completed",
      deletedCount: deleteResult.deletedCount,
      imageKitResults: imageKitDeletionResults,
    });
  } catch (error) {
    console.error("Error in bulk deleting slider images:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete slider images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
