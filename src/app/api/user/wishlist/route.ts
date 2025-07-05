import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import User from "@/components/models/User";
import jwt from "jsonwebtoken";

// Helper function to get user from token
const getUserFromToken = async (req: NextRequest) => {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as any;
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    console.error("Error getting user from token:", error);
    return null;
  }
};

// GET - Fetch user's wishlist
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      wishlist: user.wishlist || [],
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Add to wishlist if not already present
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: "Added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter((id: string) => id !== productId);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}

// PUT - Sync entire wishlist
export async function PUT(req: NextRequest) {
  try {
    await connectToDB();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { wishlist } = await req.json();

    if (!Array.isArray(wishlist)) {
      return NextResponse.json(
        { success: false, message: "Wishlist must be an array" },
        { status: 400 }
      );
    }

    // Extract product IDs from wishlist items
    const productIds = wishlist.map((item: any) =>
      typeof item === "string" ? item : item.id
    );

    user.wishlist = productIds;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Wishlist synced successfully",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error syncing wishlist:", error);
    return NextResponse.json(
      { success: false, message: "Failed to sync wishlist" },
      { status: 500 }
    );
  }
}
