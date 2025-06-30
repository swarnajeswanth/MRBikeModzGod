import { FaCheckCircle, FaClock, FaBox } from "react-icons/fa";

type Order = {
  id: string;
  date: string;
  amount: string;
  status: "Delivered" | "Processing" | "Shipped";
  icon: JSX.Element;
  color: string;
};

const orders: Order[] = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    amount: "$299.99",
    status: "Delivered",
    icon: <FaCheckCircle className="text-green-500 text-xl" />,
    color: "text-green-500",
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    amount: "$159.99",
    status: "Processing",
    icon: <FaClock className="text-yellow-400 text-xl" />,
    color: "text-yellow-400",
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    amount: "$89.99",
    status: "Shipped",
    icon: <FaBox className="text-blue-400 text-xl" />,
    color: "text-blue-400",
  },
];

const RecentOrders: React.FC = () => {
  return (
    <div className="  w-full h-full bg-[#101828] text-white p-6 rounded-lg shadow-lg  ">
      <h2 className="text-2xl font-bold mb-5">Recent Orders</h2>
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex justify-between items-center bg-[#1D2939] p-[18px] rounded-lg mb-3"
        >
          <div className="flex items-center space-x-3">
            {order.icon}
            <div>
              <p className="font-semibold">{order.id}</p>
              <p className="text-sm text-gray-400">{order.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">{order.amount}</p>
            <p className={`${order.color} text-sm`}>{order.status}</p>
          </div>
        </div>
      ))}
      <button
        disabled
        className="w-full mt-4 py-2 bg-white text-gray-500 font-medium rounded-md cursor-not-allowed"
      >
        View All Orders
      </button>
    </div>
  );
};

export default RecentOrders;
