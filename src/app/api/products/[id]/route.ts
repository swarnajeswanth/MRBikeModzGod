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

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { id },
      {
        name: body.name,
        title: body.title,
        category: body.category,
        price: parseFloat(body.price),
        originalPrice: body.originalPrice
          ? parseFloat(body.originalPrice)
          : undefined,
        discount: body.discount,
        stockCount: parseInt(body.stockCount),
        inStock: body.inStock,
        rating: body.rating ? parseFloat(body.rating) : 0,
        reviews: body.reviews ? parseInt(body.reviews) : 0,
        description: body.description,
        features: body.features || [],
        specifications: body.specifications || {},
        label: body.label,
        labelType: body.labelType,
        backgroundColor: body.backgroundColor,
        images: body.images || [],
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
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
