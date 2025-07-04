import { FaShoppingBag, FaHeart, FaBox, FaCreditCard } from "react-icons/fa";
import { ReactNode, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  selectAllProducts,
} from "@/components/store/productSlice";
import type { AppDispatch } from "@/components/store";

const DashboardStats: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectAllProducts);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: <FaBox className="text-green-400 text-3xl" />,
    },
    {
      label: "Total Orders",
      value: 12, // Placeholder
      icon: <FaShoppingBag className="text-blue-400 text-3xl" />,
    },
    {
      label: "Wishlist Items",
      value: 5, // Placeholder
      icon: <FaHeart className="text-red-400 text-3xl" />,
    },
    {
      label: "Total Spent",
      value: "$2,450", // Placeholder
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
