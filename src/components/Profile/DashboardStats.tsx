import { FaShoppingBag, FaHeart, FaCreditCard } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/components/store";

const DashboardStats: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const wishlistCount = useSelector(
    (state: RootState) => state.user.wishlist.length
  );
  const [orderStats, setOrderStats] = useState<{
    totalOrders: number | null;
    revenue: number | null;
  }>({
    totalOrders: null,
    revenue: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrderStats = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/orders?userId=${userId}`);
        const data = await res.json();
        if (data.success) {
          setOrderStats({
            totalOrders: data.totalOrders ?? 0,
            revenue: data.revenue ?? 0,
          });
        } else {
          setOrderStats({ totalOrders: 0, revenue: 0 });
        }
      } catch {
        setOrderStats({ totalOrders: 0, revenue: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchOrderStats();
  }, [userId]);

  const stats = [
    {
      label: "Total Orders",
      value: loading ? "..." : orderStats.totalOrders ?? "N/A",
      icon: <FaShoppingBag className="text-blue-400 text-3xl" />,
    },
    {
      label: "Wishlist Items",
      value: typeof wishlistCount === "number" ? wishlistCount : "N/A",
      icon: (
        <FaHeart className="text-red-400 text-3xl outline-2 outline-red-500 outline-offset-1" />
      ),
    },
    {
      label: "Total Spent",
      value: loading
        ? "..."
        : orderStats.revenue !== null
        ? `₹${orderStats.revenue}`
        : "N/A",
      icon: <FaCreditCard className="text-purple-400 text-3xl" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-[#1D2939] text-white p-6 rounded-lg flex flex-col items-center justify-center gap-3"
        >
          {stat.icon}
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
