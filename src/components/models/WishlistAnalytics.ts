import mongoose, { Schema, Document } from "mongoose";

export interface IWishlistAnalytics extends Document {
  // Customer tracking
  customerId: string;
  customerUsername: string;
  customerRole: "customer" | "retailer";

  // Login tracking
  lastLoginAt: Date;
  loginCount: number;
  firstLoginAt: Date;

  // Wishlist activity tracking
  totalWishlistItems: number;
  wishlistItems: Array<{
    productId: string;
    productName: string;
    addedAt: Date;
    removedAt?: Date;
  }>;

  // Activity timestamps
  lastWishlistActivity: Date;
  wishlistActivityCount: number;

  // Analytics data
  mostWishedProducts: Array<{
    productId: string;
    productName: string;
    wishCount: number;
  }>;

  // Session tracking
  sessions: Array<{
    sessionId: string;
    startTime: Date;
    endTime?: Date;
    wishlistActions: number;
  }>;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const WishlistAnalyticsSchema = new Schema<IWishlistAnalytics>(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
    },
    customerUsername: {
      type: String,
      required: true,
    },
    customerRole: {
      type: String,
      enum: ["customer", "retailer"],
      default: "customer",
    },

    // Login tracking
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    firstLoginAt: {
      type: Date,
      default: Date.now,
    },

    // Wishlist activity
    totalWishlistItems: {
      type: Number,
      default: 0,
    },
    wishlistItems: [
      {
        productId: {
          type: String,
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        removedAt: {
          type: Date,
          default: null,
        },
      },
    ],

    // Activity tracking
    lastWishlistActivity: {
      type: Date,
      default: Date.now,
    },
    wishlistActivityCount: {
      type: Number,
      default: 0,
    },

    // Analytics
    mostWishedProducts: [
      {
        productId: {
          type: String,
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        wishCount: {
          type: Number,
          default: 1,
        },
      },
    ],

    // Session tracking
    sessions: [
      {
        sessionId: {
          type: String,
          required: true,
        },
        startTime: {
          type: Date,
          default: Date.now,
        },
        endTime: {
          type: Date,
          default: null,
        },
        wishlistActions: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

// Indexes for better query performance
WishlistAnalyticsSchema.index({ customerId: 1 });
WishlistAnalyticsSchema.index({ lastLoginAt: -1 });
WishlistAnalyticsSchema.index({ lastWishlistActivity: -1 });
WishlistAnalyticsSchema.index({ customerRole: 1 });

const WishlistAnalytics =
  mongoose.models.WishlistAnalytics ||
  mongoose.model<IWishlistAnalytics>(
    "WishlistAnalytics",
    WishlistAnalyticsSchema
  );

export default WishlistAnalytics;
