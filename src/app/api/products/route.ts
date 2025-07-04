import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import ProductModel from "@/components/models/Products";

export const runtime = "nodejs";

// GET all products
export async function GET() {
  try {
    await connectToDB();
    const products = await ProductModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const body = await request.json();

    // Generate a unique ID (you can use a more sophisticated method)
    const uniqueId = `product_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create new product with the schema
    const newProduct = new ProductModel({
      id: uniqueId,
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
    });

    const savedProduct = await newProduct.save();
    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product: savedProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
