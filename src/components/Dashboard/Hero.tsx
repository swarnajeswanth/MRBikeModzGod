// import { button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import ShopNowButton from "./ShopNowButton";
import Headline from "./HeadLine";
import AllProductsPage from "../AllProducts";
import ProductPage from "@/components/SingleProductPage";
const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-500/10 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center bg-red-600/20 text-red-400 px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4 mr-2" />
                Premium Auto Performance Parts
              </div>

              <Headline />

              <p className="text-xl text-gray-300 max-w-lg">
                Discover premium auto spare parts and accessories that deliver
                unmatched performance, style, and reliability for your vehicle.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <ShopNowButton />

              <button className=" bg-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg">
                View Catalog
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800">
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-gray-400">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-gray-400">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">15+</div>
                <div className="text-gray-400">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-600/20 rounded-lg p-4 border border-red-600/30">
                  <div className="text-red-400 font-semibold">Engine Parts</div>
                  <div className="text-gray-300 text-sm mt-1">
                    High Performance
                  </div>
                </div>
                <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-600/30">
                  <div className="text-blue-400 font-semibold">Suspension</div>
                  <div className="text-gray-300 text-sm mt-1">
                    Premium Quality
                  </div>
                </div>
                <div className="bg-green-600/20 rounded-lg p-4 border border-green-600/30">
                  <div className="text-green-400 font-semibold">Exhaust</div>
                  <div className="text-gray-300 text-sm mt-1">Custom Tuned</div>
                </div>
                <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-600/30">
                  <div className="text-purple-400 font-semibold">
                    Electronics
                  </div>
                  <div className="text-gray-300 text-sm mt-1">Latest Tech</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
