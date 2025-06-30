import DashboardStats from "@/components/DashboardStats";
import QuickActions from "@/components/QuickActions";
import RecentOrders from "@/components/RecentOrders";
import Wishlist from "@/components/Wishlist";
import {
  Package,
  Clock,
  CheckCircle,
  User,
  Heart,
  ShoppingBag,
  MapPin,
  CreditCard,
} from "lucide-react";

const CustomerDashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-green-400";
      case "Processing":
        return "text-yellow-400";
      case "Shipped":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return CheckCircle;
      case "Processing":
        return Clock;
      case "Shipped":
        return Package;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
          <p className="text-gray-400">
            Welcome back! Here's your account overview
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid  grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <DashboardStats />

          {/* <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <div className="p-6 text-center">
              <ShoppingBag className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-gray-400 text-sm">Total Orders</p>
            </div>
          </Card> */}

          {/* <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <div className="p-6 text-center">
              <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">5</p>
              <p className="text-gray-400 text-sm">Wishlist Items</p>
            </div>
          </Card> */}

          {/* <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <div className="p-6 text-center">
              <Package className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">2</p>
              <p className="text-gray-400 text-sm">Active Orders</p>
            </div>
          </Card> */}

          {/* <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <div className="p-6 text-center">
              <CreditCard className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">$2,450</p>
              <p className="text-gray-400 text-sm">Total Spent</p>
            </div>
          </Card> */}
        </div>
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col">
            <RecentOrders />
          </div>
          <div className="flex-1 flex flex-col">
            <Wishlist />
          </div>
        </div>

        {/* Account Settings */}
        {/* <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 mt-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 py-6"
              >
                <User className="h-5 w-5 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 py-6"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Manage Addresses
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 py-6"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Methods
              </Button>
            </div>
          </div>
        </Card> */}
        <QuickActions />
      </div>
    </div>
  );
};

export default CustomerDashboard;
