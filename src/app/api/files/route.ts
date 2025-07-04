import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

export const runtime = "nodejs";

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_API_KEY!,
  privateKey: process.env.PRIVATE_API_KEY!,
  urlEndpoint: process.env.URL_ENDPOINT!,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path") || "/";
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await imagekit.listFiles({
      path: path,
      limit: limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
