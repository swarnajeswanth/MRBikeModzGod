import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import SliderImage from "@/components/models/SliderImage";

export const runtime = "nodejs";

// POST seed default slider images
export async function POST() {
  try {
    await connectToDB();

    // Check if images already exist
    const existingImages = await SliderImage.find({});
    if (existingImages.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Slider images already exist",
        count: existingImages.length,
      });
    }

    const defaultImages = [
      {
        id: `slider_seed_1_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        alt: "Premium Auto Parts Display",
        title: "Premium Auto Parts",
        description: "High-quality parts for your vehicle",
        order: 1,
      },
      {
        id: `slider_seed_2_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        alt: "Car Electronics",
        title: "Latest Car Electronics",
        description: "Advanced technology for modern vehicles",
        order: 2,
      },
      {
        id: `slider_seed_3_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        alt: "Performance Components",
        title: "Performance Components",
        description: "Upgrade your vehicle's performance",
        order: 3,
      },
      {
        id: `slider_seed_4_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        alt: "Professional Installation",
        title: "Professional Installation",
        description: "Expert installation services",
        order: 4,
      },
      {
        id: `slider_seed_5_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        alt: "Customer Service",
        title: "Expert Customer Service",
        description: "Dedicated support for all your needs",
        order: 5,
      },
    ];

    const createdImages = await SliderImage.insertMany(defaultImages);

    console.log(`Seeded ${createdImages.length} default slider images`);

    return NextResponse.json({
      success: true,
      message: "Default slider images seeded successfully",
      count: createdImages.length,
      images: createdImages,
    });
  } catch (error) {
    console.error("Error seeding slider images:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed slider images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
