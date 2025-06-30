import { FaUser, FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";
import { ReactNode } from "react";
type Action = {
  label: string;
  icon: ReactNode;
};

const actions: Action[] = [
  {
    label: "Edit Profile",
    icon: <FaUser className="text-gray-400" />,
  },
  {
    label: "Manage Addresses",
    icon: <FaMapMarkerAlt className="text-gray-400" />,
  },
  {
    label: "Payment Methods",
    icon: <FaCreditCard className="text-gray-400" />,
  },
];

const QuickActions: React.FC = () => {
  return (
    <div className="bg-[#101828] p-6 rounded-lg mt-5 ">
      <h2 className="text-xl font-bold mb-4 text-white">Quick Actions</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            disabled
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-md bg-white text-gray-400 hover:text-gray-800 font-medium cursor-pointer "
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
