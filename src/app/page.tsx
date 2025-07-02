import Header from "@/components/Header";
import Hero from "@/components/Dashboard/Hero";
import ProductCategories from "@/components/Dashboard/ProductCategories";
import FeaturedProducts from "@/components/Dashboard/FeaturedProducts";
import Footer from "@/components/Footer";
import ReviewPage from "@/components/Reviews/ReviewPage";
import WhatsAppChat from "@/components/WhatsApp_Integration/WhatsAppChat";
import GSAPScrollWrapper from "@/components/GSAPScrollWrapper"; // ⬅️ Add this

const Index = () => {
  return (
    <GSAPScrollWrapper>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-gray-900 to-black space-y-12">
        <Header />
        <section className="fade-up">
          <Hero />
        </section>
        <section className="fade-up">
          <FeaturedProducts />
        </section>
        <section className="fade-up">
          <ProductCategories />
        </section>
        <section className="fade-up">
          <ReviewPage />
        </section>
        <Footer />
        <WhatsAppChat
          phoneNumber="8499002639"
          message="Hi! I saw your auto parts reviews and I'm interested. Can you help me find the right parts for my car?"
        />
      </div>
    </GSAPScrollWrapper>
  );
};

export default Index;
