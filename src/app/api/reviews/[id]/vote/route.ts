import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import { Review } from "@/components/models/Review";

// POST vote on review (helpful/not helpful)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await params;

    const body = await request.json();
    const { voteType } = body; // 'helpful' or 'notHelpful'

    if (!voteType || !["helpful", "notHelpful"].includes(voteType)) {
      return NextResponse.json(
        { success: false, error: "Invalid vote type" },
        { status: 400 }
      );
    }

    const updateField = voteType === "helpful" ? "helpful" : "notHelpful";

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { [updateField]: 1 } },
      { new: true }
    );

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: review,
      message: `Vote recorded successfully`,
    });
  } catch (error) {
    console.error("Error voting on review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record vote" },
      { status: 500 }
    );
  }
}
