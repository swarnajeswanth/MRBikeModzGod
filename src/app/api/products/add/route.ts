import { connectToDB } from "@/components/lib/mongodb";
import Product from "@/components/models/Products";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
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

    const newProduct = await Product.create({
      name,
      description,
      price: parseFloat(price),
      category,
      image: image || "",
      stock: stock || 0,
      brand: brand || "",
      createdAt: new Date(),
      updatedAt: new Date(),
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
