"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomerDashboard from "@/components/Profile/CustomerDashboard";
import RetailerDashboard from "@/components/Profile/RetailerDashboard";
import ProtectedRoute from "@/components/Authentication/ProtectedRoute";

const DashboardPage = () => {
  const { role } = useSelector((state: RootState) => state.user);

  return (
    <ProtectedRoute requireAuth={true} redirectTo="/auth">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {role === "retailer" ? "Retailer" : "Customer"} Dashboard
            </h1>
            <p className="text-gray-400">
              Welcome to your personalized dashboard
            </p>
          </div>

          {role === "retailer" ? <RetailerDashboard /> : <CustomerDashboard />}
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
