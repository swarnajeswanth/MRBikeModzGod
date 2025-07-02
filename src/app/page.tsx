import Header from "@/components/Header";
import Hero from "@/components/Dashboard/Hero";
import ProductCategories from "@/components/Dashboard/ProductCategories";
import FeaturedProducts from "@/components/Dashboard/FeaturedProducts";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/Loaders/LoadingSpinner";
import ReviewPage from "@/components/Reviews/ReviewPage";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <Header />
      <Hero />
      <FeaturedProducts />
      <ProductCategories />
      <ReviewPage />
      <Footer />
    </div>
  );
};

export default Index;
