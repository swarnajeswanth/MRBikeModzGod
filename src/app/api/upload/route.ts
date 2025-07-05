import { NextRequest, NextResponse } from "next/server";
import {
  uploadImageToImageKit,
  listImagesFromImageKit,
} from "@/components/lib/imagekitUtils";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("File received:", file);

    // Convert File to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to ImageKit using utility function
    const result = await uploadImageToImageKit(buffer, file.name);

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path") || "/";
    const type = searchParams.get("type");

    if (type === "all") {
      // Get all files
      const result = await listImagesFromImageKit({ limit: 10 });
      return NextResponse.json(
        {
          success: true,
          files: result,
        },
        { status: 200 }
      );
    } else {
      // Get files from specific path
      const result = await listImagesFromImageKit({
        path: path,
        limit: 20,
      });
      return NextResponse.json(
        {
          success: true,
          files: result,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("List files error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch files.",
      },
      { status: 500 }
    );
  }
}
