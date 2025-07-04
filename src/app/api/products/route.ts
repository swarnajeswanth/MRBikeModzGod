import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import ProductModel from "@/components/models/Products";

export const runtime = "nodejs";

// GET all products
export async function GET() {
  try {
    await connectToDB();
    const products = await ProductModel.find({}).sort({ createdAt: -1 });
    console.log(`Fetched ${products.length} products from database`);
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

    console.log("Creating product with data:", body);

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

    // Generate a unique ID
    const uniqueId = `product_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create new product with all required fields
    const newProduct = new ProductModel({
      id: uniqueId,
      name: body.name,
      title: body.title,
      category: body.category,
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
    });

    const savedProduct = await newProduct.save();
    console.log("Product saved successfully:", savedProduct);

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
        error: "Failed to create product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
