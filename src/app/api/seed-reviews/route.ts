import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import { Review } from "@/components/models/Review";

// POST seed dummy reviews
export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    // Check if reviews already exist
    const existingReviews = await Review.countDocuments();
    if (existingReviews > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Reviews already exist in database",
        },
        { status: 400 }
      );
    }

    const dummyReviews = [
      {
        productId: "product1",
        userId: "user1",
        userName: "John Smith",
        userEmail: "john.smith@example.com",
        rating: 5,
        title: "Excellent Quality!",
        comment:
          "This product exceeded my expectations. The quality is outstanding and it works perfectly. Highly recommend to anyone looking for a reliable solution.",
        helpful: 12,
        notHelpful: 1,
        verified: true,
      },
      {
        productId: "product1",
        userId: "user2",
        userName: "Sarah Johnson",
        userEmail: "sarah.j@example.com",
        rating: 4,
        title: "Great Value for Money",
        comment:
          "Good product with solid performance. The price is reasonable and it does exactly what it promises. Would buy again.",
        helpful: 8,
        notHelpful: 2,
        verified: true,
      },
      {
        productId: "product2",
        userId: "user3",
        userName: "Mike Davis",
        userEmail: "mike.davis@example.com",
        rating: 3,
        title: "Decent but Could Be Better",
        comment:
          "The product works fine but there are some minor issues. The build quality is okay but not exceptional. It's functional for the price.",
        helpful: 5,
        notHelpful: 3,
        verified: false,
      },
      {
        productId: "product2",
        userId: "user4",
        userName: "Emily Wilson",
        userEmail: "emily.w@example.com",
        rating: 5,
        title: "Absolutely Love It!",
        comment:
          "This is exactly what I was looking for. The design is beautiful, functionality is top-notch, and customer service was excellent. Five stars!",
        helpful: 15,
        notHelpful: 0,
        verified: true,
      },
      {
        productId: "product3",
        userId: "user5",
        userName: "David Brown",
        userEmail: "david.brown@example.com",
        rating: 2,
        title: "Disappointed with Quality",
        comment:
          "The product arrived damaged and the quality is not what I expected for the price. Customer service was helpful but the product itself is subpar.",
        helpful: 3,
        notHelpful: 7,
        verified: true,
      },
    ];

    const createdReviews = await Review.insertMany(dummyReviews);

    return NextResponse.json(
      {
        success: true,
        data: createdReviews,
        message: `Successfully seeded ${createdReviews.length} reviews`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error seeding reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed reviews" },
      { status: 500 }
    );
  }
}
