import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  throw new Error("Please define the MONGODB_URI in your environment.");
}

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    return { db, client };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

// GET - Fetch store settings
export async function GET() {
  try {
    console.log("Fetching store settings...");
    const { db, client } = await connectToDatabase();

    // Get the most recent store settings (or create default if none exist)
    let settings: any = await db
      .collection("storeSettings")
      .findOne({}, { sort: { updatedAt: -1 } });

    console.log("Found settings:", settings ? "Yes" : "No");

    if (!settings) {
      console.log("Creating default settings...");
      // Create default settings if none exist
      const defaultSettings = {
        features: {
          addToCart: true,
          wishlist: true,
          reviews: true,
          ratings: true,
          search: true,
          filters: true,
          categories: true,
          productImages: true,
          productDetails: true,
          priceDisplay: true,
          stockDisplay: true,
          discountDisplay: true,
          relatedProducts: true,
          shareProducts: true,
        },
        pages: {
          home: true,
          allProducts: true,
          individualProduct: true,
          category: true,
          wishlist: true,
          cart: true,
          customerDashboard: true,
          auth: true,
        },
        storeInfo: {
          name: "MrBikeModzGod",
          description: "Premium bike parts and accessories",
          logo: "",
          theme: "dark",
          maintenanceMode: false,
          maintenanceMessage:
            "Store is under maintenance. Please check back later.",
        },
        customerExperience: {
          allowGuestBrowsing: true,
          requireLoginForPurchase: true,
          requireLoginForWishlist: true,
          showPrices: true,
          showStock: true,
          allowProductSharing: true,
          enableNotifications: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection("storeSettings").insertOne(defaultSettings);
      settings = defaultSettings;
      console.log("Default settings created successfully");
    }

    // Close the database connection
    await client.close();

    // Remove MongoDB-specific fields before sending response
    const { _id, ...settingsWithoutId } = settings || {};
    console.log("Returning settings successfully");
    return NextResponse.json(settingsWithoutId, { status: 200 });
  } catch (error) {
    console.error("Error fetching store settings:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch store settings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT - Update store settings
export async function PUT(request: NextRequest) {
  try {
    const { db, client } = await connectToDatabase();
    const body = await request.json();

    // Validate that the request is from a retailer (you can add more validation here)
    // For now, we'll allow updates (in production, add proper authentication)

    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    // Upsert the settings (update if exists, insert if not)
    const result = await db.collection("storeSettings").updateOne(
      {}, // Update the first (and should be only) document
      { $set: updateData },
      { upsert: true }
    );

    // Close the database connection
    await client.close();

    if (result.acknowledged) {
      return NextResponse.json(
        { message: "Store settings updated successfully", ...updateData },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to update store settings" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating store settings:", error);
    return NextResponse.json(
      {
        error: "Failed to update store settings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
