import DashboardStats from "@/components/Profile/DashboardStats";
import QuickActions from "@/components/Profile/QuickActions";
import RecentOrders from "@/components/Profile/RecentOrders";
import Wishlist from "@/components/Wishlist";

const CustomerDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
        <DashboardStats />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex-1 flex flex-col">
          <RecentOrders />
        </div>
        <div className="flex-1 flex flex-col">
          <Wishlist />
        </div>
      </div>

      <QuickActions />
    </div>
  );
};

export default CustomerDashboard;
