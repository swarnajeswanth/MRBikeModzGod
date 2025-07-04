import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

export const runtime = "nodejs";

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_API_KEY!,
  privateKey: process.env.PRIVATE_API_KEY!,
  urlEndpoint: process.env.URL_ENDPOINT!,
});

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

    // Upload to ImageKit
    const result = await imagekit.upload({
      file: buffer,
      fileName: file.name,
    });

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
      const result = await imagekit.listFiles({ limit: 10 });
      return NextResponse.json(
        {
          success: true,
          files: result,
        },
        { status: 200 }
      );
    } else {
      // Get files from specific path
      const result = await imagekit.listFiles({
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
