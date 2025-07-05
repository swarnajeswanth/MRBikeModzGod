import { connectToDB } from "@/components/lib/mongodb";
import Product from "@/components/models/Products";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      title,
      category,
      price,
      originalPrice,
      discount,
      stockCount,
      inStock,
      rating,
      reviews,
      description,
      features,
      specifications,
      label,
      labelType,
      backgroundColor,
      images,
    } = body;

    // Validate required fields
    if (!name || !title || !category || !price) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, title, category, and price are required.",
        },
        { status: 400 }
      );
    }

    await connectToDB();

    // Generate a unique ID
    const uniqueId = `product_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newProduct = await Product.create({
      id: uniqueId,
      name,
      title,
      category: category.toLowerCase(), // Ensure consistent lowercase category
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      discount: discount || "",
      stockCount: stockCount ? parseInt(stockCount) : 0,
      inStock: inStock !== undefined ? inStock : true,
      rating: rating ? parseFloat(rating) : 0,
      reviews: reviews ? parseInt(reviews) : 0,
      description: description || "",
      features: features || [],
      specifications: specifications || {
        Material: "",
        "Temperature Range": "",
        Compatibility: "",
        Warranty: "",
      },
      label: label || "",
      labelType: labelType || "",
      backgroundColor: backgroundColor || "#1f2937",
      images: images || [],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product added successfully!",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Add product error:", error);

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

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add product. Please try again.",
      },
      { status: 500 }
    );
  }
}
