import { connectToDB } from "@/components/lib/mongodb";
import Product from "@/components/models/Products";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectToDB();

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    // Delete product
    await Product.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully!",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete product error:", error);

    if (error.name === "CastError") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID format.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product. Please try again.",
      },
      { status: 500 }
    );
  }
}
