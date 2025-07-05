"use client";
import Header from "@/components/Header";
import Hero from "@/components/Dashboard/Hero";
import HeroSlider from "@/components/Dashboard/HeroSlider";
import FeaturedProducts from "@/components/Dashboard/FeaturedProducts";
import ProductCategories from "@/components/Dashboard/ProductCategories";
import StoreLocation from "@/components/Dashboard/StoreLocation";
import Footer from "@/components/Footer";
import ReviewPage from "@/components/Reviews/ReviewPage";
import WhatsAppChat from "@/components/WhatsApp_Integration/WhatsAppChat";
import GSAPScrollWrapper from "@/components/GSAPScrollWrapper";
import { useSelector } from "react-redux";
import { selectIsPageAccessible } from "@/components/store/storeSettingsSlice";
import GuestAccessGuard from "@/components/GuestAccessGuard";

const Index = () => {
  const isHomeAccessible = useSelector(selectIsPageAccessible("home"));
  if (!isHomeAccessible) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black/80">
        <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
        <p className="text-gray-400 mb-4">
          This page is currently not accessible.
        </p>
      </div>
    );
  }

  return (
    <GuestAccessGuard>
      <GSAPScrollWrapper>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-gray-900 to-black">
          <Header />

          {/* Hero Section - Full Viewport Height */}
          <section className="fade-up flex-1">
            <Hero />
          </section>

          {/* Other Sections */}

          <section className="fade-up">
            <FeaturedProducts />
          </section>
          <section className="fade-up">
            <ProductCategories />
          </section>
          <section className="fade-up">
            <StoreLocation />
          </section>
          <section className="fade-up">
            <ReviewPage />
          </section>
          <Footer />
          <WhatsAppChat
            phoneNumber="6304187805"
            message="Hi! I saw your auto parts reviews and I'm interested. Can you help me find the right parts for my bike?"
          />
        </div>
      </GSAPScrollWrapper>
    </GuestAccessGuard>
  );
};

export default Index;
