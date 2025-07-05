import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      GMAIL_USER: !!process.env.GMAIL_USER,
      GMAIL_APP_PASSWORD: !!process.env.GMAIL_APP_PASSWORD,
      JWT_SECRET: !!process.env.JWT_SECRET,
      PUBLIC_API_KEY: !!process.env.PUBLIC_API_KEY,
      PRIVATE_API_KEY: !!process.env.PRIVATE_API_KEY,
      URL_ENDPOINT: !!process.env.URL_ENDPOINT,
    };

    // Test email configuration
    let emailConfigTest = "Not tested";
    try {
      const { getEmailConfig } = await import("@/components/lib/emailUtils");
      getEmailConfig();
      emailConfigTest = "✅ Email configuration is valid";
    } catch (error) {
      emailConfigTest = `❌ Email configuration error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
    }

    return NextResponse.json({
      success: true,
      environment: envCheck,
      emailConfigTest,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
