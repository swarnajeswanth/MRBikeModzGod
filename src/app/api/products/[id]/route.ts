import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import ProductModel from "@/components/models/Products";

export const runtime = "nodejs";

// GET single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await params;
    const product = await ProductModel.findOne({ id });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await params;
    const body = await request.json();

    console.log("Updating product with ID:", id, "Data:", body);

    // Validate required fields
    if (!body.name || !body.title || !body.category || !body.price) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, title, category, and price are required fields.",
        },
        { status: 400 }
      );
    }

    const updateData = {
      name: body.name,
      title: body.title,
      category: body.category.toLowerCase(), // Ensure consistent lowercase category
      price: parseFloat(body.price),
      originalPrice: body.originalPrice
        ? parseFloat(body.originalPrice)
        : undefined,
      discount: body.discount || "",
      stockCount: body.stockCount ? parseInt(body.stockCount) : 0,
      inStock: body.inStock !== undefined ? body.inStock : true,
      rating: body.rating ? parseFloat(body.rating) : 0,
      reviews: body.reviews ? parseInt(body.reviews) : 0,
      description: body.description || "",
      features: body.features || [],
      specifications: body.specifications || {
        Material: "",
        "Temperature Range": "",
        Compatibility: "",
        Warranty: "",
      },
      label: body.label || "",
      labelType: body.labelType || "",
      backgroundColor: body.backgroundColor || "#1f2937",
      images: body.images || [],
    };

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    console.log("Product updated successfully:", updatedProduct);

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    // Handle specific MongoDB errors
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A product with this name already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await params;
    const deletedProduct = await ProductModel.findOneAndDelete({
      id,
    });

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
