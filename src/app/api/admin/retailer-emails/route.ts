import { NextResponse } from "next/server";
import { getWhitelistedEmails } from "@/components/lib/retailerConfig";

export async function GET() {
  try {
    const whitelistedEmails = getWhitelistedEmails();

    return NextResponse.json({
      success: true,
      data: {
        whitelistedEmails,
        count: whitelistedEmails.length,
      },
    });
  } catch (error) {
    console.error("Error fetching whitelisted emails:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch whitelisted emails",
      },
      { status: 500 }
    );
  }
}
