import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import SliderImage from "@/components/models/SliderImage";
import {
  listImagesFromImageKit,
  deleteMultipleImagesFromImageKit,
} from "@/components/lib/imagekitUtils";

export const runtime = "nodejs";

// POST cleanup orphaned ImageKit files
export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const body = await request.json();
    const { dryRun = true } = body; // Default to dry run for safety

    console.log("Starting ImageKit cleanup process, dry run:", dryRun);

    // Get all ImageKit files in the slider-images folder
    const imageKitFiles = await listImagesFromImageKit({
      path: "/slider-images",
      limit: 1000, // Adjust as needed
    });

    // Get all ImageKit IDs from database
    const dbImages = await SliderImage.find({}, { imageKitId: 1 });
    const dbImageKitIds = new Set(
      dbImages.map((img) => img.imageKitId).filter((id) => id)
    );

    // Find orphaned files (files in ImageKit but not in database)
    const orphanedFiles = imageKitFiles.filter(
      (file) => !dbImageKitIds.has(file.fileId)
    );
    const orphanedFileIds = orphanedFiles.map((file) => file.fileId);

    console.log("Cleanup analysis:", {
      totalImageKitFiles: imageKitFiles.length,
      totalDbImages: dbImages.length,
      orphanedFiles: orphanedFiles.length,
      dryRun: dryRun,
    });

    if (orphanedFiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No orphaned files found",
        orphanedCount: 0,
        dryRun: dryRun,
      });
    }

    let deletionResults = { success: [] as string[], failed: [] as string[] };

    if (!dryRun && orphanedFileIds.length > 0) {
      // Actually delete the orphaned files
      deletionResults = await deleteMultipleImagesFromImageKit(orphanedFileIds);
    }

    return NextResponse.json({
      success: true,
      message: dryRun ? "Cleanup analysis completed" : "Cleanup completed",
      orphanedCount: orphanedFiles.length,
      dryRun: dryRun,
      deletionResults: dryRun ? null : deletionResults,
      orphanedFiles: dryRun
        ? orphanedFiles.map((f) => ({ fileId: f.fileId, name: f.name }))
        : null,
    });
  } catch (error) {
    console.error("Error in ImageKit cleanup:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform cleanup",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
