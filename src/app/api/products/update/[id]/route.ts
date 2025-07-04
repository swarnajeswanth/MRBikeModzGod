import { connectToDB } from "@/components/lib/mongodb";
import Product from "@/components/models/Products";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, price, category, image, stock, brand } = body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, description, price, and category are required.",
        },
        { status: 400 }
      );
    }

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

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price: parseFloat(price),
        category,
        image: image || existingProduct.image,
        stock: stock || existingProduct.stock,
        brand: brand || existingProduct.brand,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully!",
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update product error:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "A product with this name already exists.",
        },
        { status: 409 }
      );
    }

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
        message: "Failed to update product. Please try again.",
      },
      { status: 500 }
    );
  }
}
