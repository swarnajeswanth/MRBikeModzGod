import DashboardStats from "@/components/Profile/DashboardStats";
import QuickActions from "@/components/Profile/QuickActions";
import RecentOrders from "@/components/Profile/RecentOrders";
import WishlistGrid from "@/components/Dashboard/WishlistGrid";
import PersonalInfoCard from "./PersonalInfoCard";
import { FaLock } from "react-icons/fa";

const LockOverlay = () => (
  <div
    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 cursor-not-allowed"
    style={{ backdropFilter: "blur(2px)" }}
  >
    <FaLock className="text-white text-4xl opacity-80 mb-2" />
    <span className="text-white text-sm opacity-80">Locked</span>
  </div>
);

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Card */}
        <PersonalInfoCard />
        {/* Header */}
        <div className="mb-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
            <DashboardStats />
          </div>

          <div className="flex flex-col lg:flex-row gap-4 w-full">
            <div className="flex-1 flex flex-col relative">
              <RecentOrders />
              <LockOverlay />
            </div>
            <div className="flex-1 flex flex-col relative">
              <WishlistGrid
                title="My Wishlist"
                description="Your saved items for later"
                maxItems={4}
                showEmptyState={true}
              />
              <LockOverlay />
            </div>
          </div>

          <div className="relative">
            <QuickActions />
            <LockOverlay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
