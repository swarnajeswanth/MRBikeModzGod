// components/CategoryClient.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Cog,
  Zap,
  Gauge,
  Settings,
  Car,
  Wrench,
  Battery,
  Disc,
  Search,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";

interface Props {
  categoryName: string;
}
const categoryData = {
  "engine-parts": {
    name: "Engine Parts",
    description: "High-performance engine components",
    icon: Cog,
    color: "from-red-500 to-red-600",
    textColor: "text-red-400",
  },
  "exhaust-systems": {
    name: "Exhaust Systems",
    description: "Custom exhaust solutions",
    icon: Zap,
    color: "from-orange-500 to-orange-600",
    textColor: "text-orange-400",
  },
  suspension: {
    name: "Suspension",
    description: "Premium suspension upgrades",
    icon: Gauge,
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-400",
  },
  electronics: {
    name: "Electronics",
    description: "Advanced automotive electronics",
    icon: Settings,
    color: "from-purple-500 to-purple-600",
    textColor: "text-purple-400",
  },
  "body-parts": {
    name: "Body Parts",
    description: "Styling and body modifications",
    icon: Car,
    color: "from-green-500 to-green-600",
    textColor: "text-green-400",
  },
  "tools-equipment": {
    name: "Tools & Equipment",
    description: "Professional automotive tools",
    icon: Wrench,
    color: "from-yellow-500 to-yellow-600",
    textColor: "text-yellow-400",
  },
  electrical: {
    name: "Electrical",
    description: "Wiring and electrical components",
    icon: Battery,
    color: "from-indigo-500 to-indigo-600",
    textColor: "text-indigo-400",
  },
  brakes: {
    name: "Brakes",
    description: "High-performance brake systems",
    icon: Disc,
    color: "from-pink-500 to-pink-600",
    textColor: "text-pink-400",
  },
};

const sampleProducts = {
  "engine-parts": [
    {
      id: 1,
      name: "Performance Air Filter",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    },
    {
      id: 2,
      name: "Turbo Charger Kit",
      price: 899.99,
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
    },
    {
      id: 3,
      name: "Engine Oil Cooler",
      price: 299.99,
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
    },
  ],
  "exhaust-systems": [
    {
      id: 4,
      name: "Sport Exhaust System",
      price: 799.99,
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
    },
    {
      id: 5,
      name: "Cat-Back Exhaust",
      price: 549.99,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    },
    {
      id: 6,
      name: "Performance Muffler",
      price: 199.99,
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
    },
  ],
  suspension: [
    {
      id: 7,
      name: "Coilover Kit",
      price: 1299.99,
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
    },
    {
      id: 8,
      name: "Performance Shocks",
      price: 599.99,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    },
    {
      id: 9,
      name: "Sway Bar Kit",
      price: 299.99,
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
    },
  ],
  electronics: [
    {
      id: 10,
      name: "LED Headlights",
      price: 159.99,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    },
    {
      id: 11,
      name: "Backup Camera",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
    },
    {
      id: 12,
      name: "GPS Navigation",
      price: 399.99,
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
    },
  ],
  "body-parts": [
    {
      id: 13,
      name: "Front Bumper",
      price: 599.99,
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
    },
    {
      id: 14,
      name: "Side Skirts",
      price: 299.99,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    },
    {
      id: 15,
      name: "Rear Spoiler",
      price: 199.99,
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
    },
  ],
  "tools-equipment": [
    {
      id: 16,
      name: "Socket Wrench Set",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    },
    {
      id: 17,
      name: "Car Jack",
      price: 159.99,
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
    },
    {
      id: 18,
      name: "Diagnostic Scanner",
      price: 299.99,
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
    },
  ],
  electrical: [
    {
      id: 19,
      name: "Wiring Harness",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
    },
    {
      id: 20,
      name: "Battery Charger",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    },
    {
      id: 21,
      name: "Fuse Box",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
    },
  ],
  brakes: [
    {
      id: 22,
      name: "Brake Pads Set",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    },
    {
      id: 23,
      name: "Brake Rotors",
      price: 199.99,
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
    },
    {
      id: 24,
      name: "Brake Calipers",
      price: 299.99,
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
    },
  ],
};

export default function CategoryClient({ categoryName }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const currentCategory =
    categoryData[categoryName as keyof typeof categoryData];
  const products =
    sampleProducts[categoryName as keyof typeof sampleProducts] || [];

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-white">
            <h1 className="text-4xl mb-4">Category Not Found</h1>
            <button
              onClick={() => router.back()}
              className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const Icon = currentCategory.icon;
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <section className="py-6 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/")}
            className="text-gray-300 hover:text-red-400 mb-8 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>

          <div className="text-center mb-12">
            <div
              className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r ${currentCategory.color} flex items-center justify-center`}
            >
              <Icon className="h-12 w-12 text-white" />
            </div>
            <h1
              className={`text-4xl lg:text-5xl font-bold ${currentCategory.textColor} mb-4`}
            >
              {currentCategory.name}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {currentCategory.description}
            </p>
          </div>

          <div className="max-w-md mx-auto mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border border-gray-700 text-white rounded px-3 py-2 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:bg-gray-700/50 transition-all duration-300 group"
              >
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-400">
                      ${product.price}
                    </span>
                    <button className="bg-red-600 hover:bg-red-700 p-2 flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No products found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
