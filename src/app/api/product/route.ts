// Example: src/app/api/products/route.ts
import dbConnect from "@/components/lib/mongodb";
import Product from "@/components//models/Products";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const products = await Product.find({});
  return NextResponse.json(products);
}
