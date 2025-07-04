import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import SliderImage from "@/components/models/SliderImage";
import ImageKit from "imagekit";

export const runtime = "nodejs";

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_API_KEY!,
  privateKey: process.env.PRIVATE_API_KEY!,
  urlEndpoint: process.env.URL_ENDPOINT!,
});

// PUT update slider image
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await params;
    const body = await request.json();
    const { alt, title, description } = body;

    const image = await SliderImage.findOne({ id });
    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (alt !== undefined) image.alt = alt;
    if (title !== undefined) image.title = title;
    if (description !== undefined) image.description = description;

    const updatedImage = await image.save();

    console.log("Slider image updated successfully:", updatedImage);

    return NextResponse.json({
      success: true,
      message: "Slider image updated successfully",
      image: updatedImage,
    });
  } catch (error) {
    console.error("Error updating slider image:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update slider image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE slider image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await params;

    const image = await SliderImage.findOne({ id });
    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    // Delete from ImageKit if imageKitId exists
    if (image.imageKitId) {
      try {
        await imagekit.deleteFile(image.imageKitId);
        console.log("Image deleted from ImageKit:", image.imageKitId);
      } catch (imageKitError) {
        console.warn("Failed to delete from ImageKit:", imageKitError);
        // Continue with database deletion even if ImageKit deletion fails
      }
    }

    // Delete from database
    await SliderImage.deleteOne({ id });

    console.log("Slider image deleted successfully:", id);

    return NextResponse.json({
      success: true,
      message: "Slider image deleted successfully",
      id: id,
    });
  } catch (error) {
    console.error("Error deleting slider image:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete slider image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
