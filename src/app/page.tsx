import Header from "@/components/Header";
import Hero from "@/components/Dashboard/Hero";
import ProductCategories from "@/components/Dashboard/ProductCategories";
import FeaturedProducts from "@/components/Dashboard/FeaturedProducts";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/Loaders/LoadingSpinner";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <Header />
      <Hero />
      <FeaturedProducts />
      <ProductCategories />
      <Footer />
    </div>
  );
};

export default Index;
