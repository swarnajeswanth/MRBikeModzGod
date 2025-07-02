import Header from "@/components/Header";
import Hero from "@/components/Dashboard/Hero";
import ProductCategories from "@/components/Dashboard/ProductCategories";
import FeaturedProducts from "@/components/Dashboard/FeaturedProducts";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/Loaders/LoadingSpinner";
import ReviewPage from "@/components/Reviews/ReviewPage";
import WhatsAppChat from "@/components/WhatsApp_Integration/WhatsAppChat";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <Header />
      <Hero />
      <FeaturedProducts />
      <ProductCategories />
      <ReviewPage />
      <Footer />
      <WhatsAppChat
        phoneNumber="8499002639"
        message="Hi! I saw your auto parts reviews and I'm interested. Can you help me find the right parts for my car?"
      />
    </div>
  );
};

export default Index;
