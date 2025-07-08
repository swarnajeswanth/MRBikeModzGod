import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/components/lib/mongodb";
import Order from "@/components/models/Order";

// GET /api/orders?month=YYYY-MM&status=paid
export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // e.g., "2024-05"
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");

    const filter: any = {};
    if (month) {
      const [year, mon] = month.split("-");
      const start = new Date(Number(year), Number(mon) - 1, 1);
      const end = new Date(Number(year), Number(mon), 1);
      filter.createdAt = { $gte: start, $lt: end };
    }
    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    const orders = await Order.find(filter).lean();
    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    return NextResponse.json({ success: true, orders, totalOrders, revenue });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders
export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();
    const { userId, items, total, status, createdAt, misc } = body;
    if (!userId || !Array.isArray(items) || typeof total !== "number") {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderDate = createdAt ? new Date(createdAt) : new Date();

    // Check if an order already exists for this date and user
    const startOfDay = new Date(orderDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(orderDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingOrder = await Order.findOne({
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    let order;
    if (existingOrder) {
      // Update existing order
      const orderData: any = { items, total, status };
      if (misc !== undefined) orderData.misc = misc;

      order = await Order.findByIdAndUpdate(existingOrder._id, orderData, {
        new: true,
      });
    } else {
      // Create new order
      const orderData: any = { userId, items, total, status };
      if (createdAt) orderData.createdAt = orderDate;
      if (misc) orderData.misc = misc;

      order = await Order.create(orderData);
    }

    return NextResponse.json({
      success: true,
      order,
      isUpdate: !!existingOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}

// DELETE /api/orders?userId=xxx&date=YYYY-MM-DD
export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const date = searchParams.get("date"); // YYYY-MM-DD format

    if (!userId || !date) {
      return NextResponse.json(
        { success: false, message: "Missing userId or date parameter" },
        { status: 400 }
      );
    }

    // Parse the date and create date range for the entire day
    const [year, month, day] = date.split("-").map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    // Find and delete the order for this specific date and user
    const deletedOrder = await Order.findOneAndDelete({
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!deletedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found for this date" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
      deletedOrder,
    });
  } catch (error) {
    console.error("Order deletion error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete order" },
      { status: 500 }
    );
  }
}
