import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import WishlistAnalytics from "@/components/models/WishlistAnalytics";
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

// GET - Fetch wishlist analytics for retailer dashboard
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

    // Only retailers can access analytics
    if (user.role !== "retailer") {
      return NextResponse.json(
        { success: false, message: "Access denied. Retailer role required." },
        { status: 403 }
      );
    }

    // Get all wishlist analytics data
    const analytics = await WishlistAnalytics.find({}).sort({
      lastLoginAt: -1,
    });

    // Calculate aggregated statistics
    const totalWishlistItems = analytics.reduce(
      (sum, item) => sum + item.totalWishlistItems,
      0
    );
    const activeUsers = analytics.filter((item) => {
      const lastActivity = new Date(item.lastWishlistActivity);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastActivity > thirtyDaysAgo;
    }).length;

    // Get most wished products across all users
    const productWishCounts: {
      [key: string]: { name: string; count: number };
    } = {};

    analytics.forEach((userAnalytics) => {
      userAnalytics.mostWishedProducts.forEach((product: any) => {
        if (!productWishCounts[product.productId]) {
          productWishCounts[product.productId] = {
            name: product.productName,
            count: 0,
          };
        }
        productWishCounts[product.productId].count += product.wishCount;
      });
    });

    const mostWishedProducts = Object.entries(productWishCounts)
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        wishCount: data.count,
      }))
      .sort((a, b) => b.wishCount - a.wishCount)
      .slice(0, 10);

    // Get recent wishlist activity
    const recentActivity = analytics
      .filter((item) => item.wishlistItems.length > 0)
      .flatMap((item) =>
        item.wishlistItems
          .filter((wishlistItem: any) => !wishlistItem.removedAt) // Only active items
          .map((wishlistItem: any) => ({
            customerId: item.customerId,
            customerUsername: item.customerUsername,
            productId: wishlistItem.productId,
            productName: wishlistItem.productName,
            addedAt: wishlistItem.addedAt,
            lastLoginAt: item.lastLoginAt,
          }))
      )
      .sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      )
      .slice(0, 20);

    // Get customer login statistics
    const customerStats = analytics.map((item) => ({
      customerId: item.customerId,
      customerUsername: item.customerUsername,
      loginCount: item.loginCount,
      lastLoginAt: item.lastLoginAt,
      firstLoginAt: item.firstLoginAt,
      totalWishlistItems: item.totalWishlistItems,
      wishlistActivityCount: item.wishlistActivityCount,
      lastWishlistActivity: item.lastWishlistActivity,
    }));

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalWishlistItems,
          activeUsers,
          totalCustomers: analytics.length,
          mostWishedItem: mostWishedProducts[0] || null,
        },
        mostWishedProducts,
        recentActivity,
        customerStats,
      },
    });
  } catch (error) {
    console.error("Error fetching wishlist analytics:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

// POST - Track customer login
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

    const { action, productId, productName, sessionId } = await req.json();

    // Find or create analytics record for this customer
    let analytics = await WishlistAnalytics.findOne({
      customerId: user._id.toString(),
    });

    if (!analytics) {
      // Create new analytics record for first-time user
      analytics = new WishlistAnalytics({
        customerId: user._id.toString(),
        customerUsername: user.username,
        customerRole: user.role,
        loginCount: 1,
        firstLoginAt: new Date(),
        lastLoginAt: new Date(),
        sessions: [
          {
            sessionId: sessionId || `session_${Date.now()}`,
            startTime: new Date(),
            wishlistActions: 0,
          },
        ],
      });
    } else {
      // Update existing analytics
      analytics.lastLoginAt = new Date();
      analytics.loginCount += 1;

      // Add new session if sessionId provided
      if (sessionId) {
        analytics.sessions.push({
          sessionId,
          startTime: new Date(),
          wishlistActions: 0,
        });
      }
    }

    // Handle wishlist actions
    if (action === "add_to_wishlist" && productId && productName) {
      analytics.lastWishlistActivity = new Date();
      analytics.wishlistActivityCount += 1;
      analytics.totalWishlistItems += 1;

      // Add to wishlist items
      analytics.wishlistItems.push({
        productId,
        productName,
        addedAt: new Date(),
      });

      // Update most wished products
      const existingProduct = analytics.mostWishedProducts.find(
        (p: any) => p.productId === productId
      );

      if (existingProduct) {
        existingProduct.wishCount += 1;
      } else {
        analytics.mostWishedProducts.push({
          productId,
          productName,
          wishCount: 1,
        });
      }

      // Update session wishlist actions
      if (sessionId && analytics.sessions.length > 0) {
        const currentSession =
          analytics.sessions[analytics.sessions.length - 1];
        if (currentSession.sessionId === sessionId) {
          currentSession.wishlistActions += 1;
        }
      }
    }

    if (action === "remove_from_wishlist" && productId) {
      analytics.lastWishlistActivity = new Date();
      analytics.wishlistActivityCount += 1;
      analytics.totalWishlistItems = Math.max(
        0,
        analytics.totalWishlistItems - 1
      );

      // Mark item as removed
      const wishlistItem = analytics.wishlistItems.find(
        (item: any) => item.productId === productId && !item.removedAt
      );
      if (wishlistItem) {
        wishlistItem.removedAt = new Date();
      }

      // Update session wishlist actions
      if (sessionId && analytics.sessions.length > 0) {
        const currentSession =
          analytics.sessions[analytics.sessions.length - 1];
        if (currentSession.sessionId === sessionId) {
          currentSession.wishlistActions += 1;
        }
      }
    }

    await analytics.save();

    return NextResponse.json({
      success: true,
      message: "Analytics updated successfully",
    });
  } catch (error) {
    console.error("Error updating analytics:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update analytics" },
      { status: 500 }
    );
  }
}
