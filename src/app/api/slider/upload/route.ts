import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import SliderImage from "@/components/models/SliderImage";
import { uploadImageToImageKit } from "@/components/lib/imagekitUtils";

export const runtime = "nodejs";

// POST new slider image
export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const formData = await request.formData();

    const file = formData.get("file") as File;
    const alt = formData.get("alt") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (!alt) {
      return NextResponse.json(
        { success: false, error: "Alt text is required" },
        { status: 400 }
      );
    }

    console.log("Uploading slider image:", { alt, title, description });

    // Convert File to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to ImageKit using utility function
    const imageKitResult = await uploadImageToImageKit(
      buffer,
      `slider_${Date.now()}_${file.name}`,
      "/slider-images"
    );

    // Get the highest order number
    const lastImage = await SliderImage.findOne().sort({ order: -1 });
    const nextOrder = (lastImage?.order || 0) + 1;

    // Generate unique ID
    const uniqueId = `slider_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create new slider image
    const newSliderImage = new SliderImage({
      id: uniqueId,
      url: imageKitResult.url,
      alt: alt,
      title: title || "",
      description: description || "",
      order: nextOrder,
      imageKitId: imageKitResult.fileId,
      imageKitUrl: imageKitResult.url,
    });

    const savedImage = await newSliderImage.save();

    console.log("Slider image uploaded successfully:", savedImage);

    return NextResponse.json(
      {
        success: true,
        message: "Slider image uploaded successfully",
        image: savedImage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading slider image:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload slider image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
