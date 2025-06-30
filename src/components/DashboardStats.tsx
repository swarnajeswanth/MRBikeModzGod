import { FaShoppingBag, FaHeart, FaBox, FaCreditCard } from "react-icons/fa";
import { ReactNode } from "react";

type StatCard = {
  label: string;
  value: string | number;
  icon: ReactNode;
};

const stats: StatCard[] = [
  {
    label: "Total Orders",
    value: 12,
    icon: <FaShoppingBag className="text-blue-400 text-3xl" />,
  },
  {
    label: "Wishlist Items",
    value: 5,
    icon: <FaHeart className="text-red-400 text-3xl" />,
  },
  {
    label: "Active Orders",
    value: 2,
    icon: <FaBox className="text-green-400 text-3xl" />,
  },
  {
    label: "Total Spent",
    value: "$2,450",
    icon: <FaCreditCard className="text-purple-400 text-3xl" />,
  },
];

const DashboardStats: React.FC = () => {
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
