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

    // Check if product exists using the custom 'id' field
    const existingProduct = await Product.findOne({ id });
    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    // Update product using the custom 'id' field
    const updatedProduct = await Product.findOneAndUpdate(
      { id },
      {
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

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product. Please try again.",
      },
      { status: 500 }
    );
  }
}
