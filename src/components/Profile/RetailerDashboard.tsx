"use client";
import React, { useState } from "react";
import {
  FaBox,
  FaUsers,
  FaDollarSign,
  FaChartLine,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCog,
  FaImages,
  FaHeart,
} from "react-icons/fa";

interface WishlistAnalytics {
  summary: {
    totalWishlistItems: number;
    activeUsers: number;
    totalCustomers: number;
    mostWishedItem: {
      productId: string;
      productName: string;
      wishCount: number;
    } | null;
  };
  mostWishedProducts: Array<{
    productId: string;
    productName: string;
    wishCount: number;
  }>;
  recentActivity: Array<{
    customerId: string;
    customerUsername: string;
    productId: string;
    productName: string;
    addedAt: string;
    lastLoginAt: string;
  }>;
  customerStats: Array<{
    customerId: string;
    customerUsername: string;
    loginCount: number;
    lastLoginAt: string;
    firstLoginAt: string;
    totalWishlistItems: number;
    wishlistActivityCount: number;
    lastWishlistActivity: string;
  }>;
}
import AddProductModal, {
  ProductForm,
} from "@/components/Profile/AddProductModal";
import StoreSettings from "@/components/Profile/StoreSettings";
import SliderManager from "./SliderManager";
import WishlistGrid from "@/components/Dashboard/WishlistGrid";
import { useSelector } from "react-redux";
import {
  selectAllProducts,
  selectLoading,
  selectError,
  selectCreateLoading,
  selectUpdateLoading,
  selectDeleteLoading,
  selectFetchLoading,
} from "@/components/store/productSlice";
import { useDispatch } from "react-redux";
import {
  updateProduct,
  createProduct,
  updateProductById,
  deleteProductById,
  fetchProducts,
} from "@/components/store/productSlice";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import LoadingButton from "@/components/Loaders/LoadingButton";
import { RootState } from "@/components/store";
import { useLoading } from "@/components/hooks/useLoading";
import SimpleLoadingSpinner from "@/components/Loaders/SimpleLoadingSpinner";

const RetailerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("products");
  const itemsPerPage = 4;
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const createLoading = useSelector(selectCreateLoading);
  const updateLoading = useSelector(selectUpdateLoading);
  const deleteLoading = useSelector(selectDeleteLoading);
  const fetchLoading = useSelector(selectFetchLoading);
  const dispatch = useDispatch();
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const { isLoading: pageLoading, withLoading } = useLoading();

  // Wishlist analytics state
  const [wishlistAnalytics, setWishlistAnalytics] =
    useState<WishlistAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    withLoading(
      () => dispatch(fetchProducts() as any),
      "Loading dashboard data..."
    );
  }, [dispatch, withLoading]);

  // Fetch wishlist analytics
  const fetchWishlistAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch("/api/admin/wishlist-analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setWishlistAnalytics(data.data);
        } else {
          toast.error("Failed to fetch analytics");
        }
      } else {
        toast.error("Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to fetch analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch analytics when wishlist tab is active
  useEffect(() => {
    if (activeTab === "wishlist") {
      fetchWishlistAnalytics();
    }
  }, [activeTab]);

  // --- Monthly Analytics ---
  const [monthStats, setMonthStats] = useState({ totalOrders: 0, revenue: 0 });
  const [prevMonthStats, setPrevMonthStats] = useState({
    totalOrders: 0,
    revenue: 0,
  });
  const [monthGrowth, setMonthGrowth] = useState<string | null>(null);

  // Function to get cached growth for current month
  const getCachedGrowth = () => {
    try {
      const currentDate = new Date();
      const monthKey = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;
      const cached = localStorage.getItem(`monthlyGrowth_${monthKey}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Error reading cached growth:", error);
    }
    return null;
  };

  // Function to cache growth for current month
  const cacheGrowth = (growth: string) => {
    try {
      const currentDate = new Date();
      const monthKey = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;
      localStorage.setItem(`monthlyGrowth_${monthKey}`, JSON.stringify(growth));
    } catch (error) {
      console.error("Error caching growth:", error);
    }
  };

  // Function to calculate and cache growth
  const calculateAndCacheGrowth = () => {
    let growth: string;
    if (prevMonthStats.revenue === 0 && monthStats.revenue === 0) {
      growth = "N/A";
    } else if (prevMonthStats.revenue === 0) {
      growth = "∞";
    } else {
      const percent =
        ((monthStats.revenue - prevMonthStats.revenue) /
          prevMonthStats.revenue) *
        100;
      growth = percent.toFixed(1) + "%";
    }

    setMonthGrowth(growth);
    cacheGrowth(growth);
  };

  // Function to fetch monthly stats
  const fetchMonthStats = async (year: number, month: number, setter: any) => {
    try {
      const yyyy = year;
      const mm = (month + 1).toString().padStart(2, "0");
      const res = await fetch(`/api/orders?month=${yyyy}-${mm}&status=paid`);
      const data = await res.json();
      if (data.success) {
        setter({
          totalOrders: data.totalOrders || 0,
          revenue: data.revenue || 0,
        });
      } else {
        setter({ totalOrders: 0, revenue: 0 });
      }
    } catch {
      setter({ totalOrders: 0, revenue: 0 });
    }
  };

  // Function to refresh all monthly stats
  const refreshMonthlyStats = async () => {
    const currentDate = new Date();
    await fetchMonthStats(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      setMonthStats
    );
    let prevYear = currentDate.getFullYear();
    let prevMonth = currentDate.getMonth() - 1;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear -= 1;
    }
    await fetchMonthStats(prevYear, prevMonth, setPrevMonthStats);

    // Check if we need to recalculate growth (new month or no cache)
    const cachedGrowth = getCachedGrowth();
    if (!cachedGrowth) {
      // Small delay to ensure stats are updated before calculating growth
      setTimeout(() => {
        calculateAndCacheGrowth();
      }, 100);
    }
  };

  // Listen for order changes from cart page
  useEffect(() => {
    const handleOrderChange = (event: StorageEvent) => {
      if (event.key === "orderUpdated" && event.newValue) {
        // Refresh stats when order is updated
        refreshMonthlyStats();
        // Clear the flag
        localStorage.removeItem("orderUpdated");
      }
    };

    // Listen for storage events (when cart page updates localStorage)
    window.addEventListener("storage", handleOrderChange);

    // Also check for localStorage changes on the same page
    const checkForOrderUpdates = () => {
      const orderUpdated = localStorage.getItem("orderUpdated");
      if (orderUpdated) {
        refreshMonthlyStats();
        localStorage.removeItem("orderUpdated");
      }
    };

    // Check periodically for order updates
    const interval = setInterval(checkForOrderUpdates, 1000);

    return () => {
      window.removeEventListener("storage", handleOrderChange);
      clearInterval(interval);
    };
  }, []);

  // Load cached growth on mount and calculate only if not cached
  useEffect(() => {
    const cachedGrowth = getCachedGrowth();
    if (cachedGrowth) {
      setMonthGrowth(cachedGrowth);
    } else {
      // Only calculate if we have both current and previous month stats
      if (monthStats.revenue > 0 || prevMonthStats.revenue > 0) {
        calculateAndCacheGrowth();
      }
    }
  }, [monthStats, prevMonthStats]);

  // Function to clear old cached growth (when new month starts)
  const clearOldCachedGrowth = () => {
    try {
      const currentDate = new Date();
      const currentMonthKey = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;

      // Clear all cached growth except current month
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          key.startsWith("monthlyGrowth_") &&
          !key.includes(currentMonthKey)
        ) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error("Error clearing old cached growth:", error);
    }
  };

  // Fetch monthly stats on mount
  useEffect(() => {
    clearOldCachedGrowth(); // Clear old cached growth first
    refreshMonthlyStats();
  }, []); // <--- Only once on mount

  // Function to manually refresh stats and recalculate growth
  const manualRefreshStats = async () => {
    // Clear cached growth to force recalculation
    const currentDate = new Date();
    const monthKey = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;
    localStorage.removeItem(`monthlyGrowth_${monthKey}`);

    await refreshMonthlyStats();
    toast.success("Stats refreshed successfully");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSliderManagerOpen, setIsSliderManagerOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    title: "",
    category: "",
    price: "",
    originalPrice: "",
    discount: "",
    stockCount: "",
    inStock: true,
    rating: "",
    reviews: "",
    description: "",
    features: [],
    specifications: {},
    label: "",
    labelType: "",
    images: [],
  });

  const [productList, setProductList] = useState(products);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (product: any) => {
    setForm({
      name: product.name || "",
      title: product.title || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      originalPrice: product.originalPrice?.toString() || "",
      discount: product.discount?.toString() || "",
      stockCount: product.stockCount?.toString() || "0",
      inStock: product.inStock ?? true,
      rating: product.rating?.toString() || "",
      reviews: product.reviews?.toString() || "",
      description: product.description || "",
      features: product.features || [],
      specifications: product.specifications || {},
      label: product.label || "",
      labelType: product.labelType || "",
      images: product.images || [],
    });

    setEditProductId(product.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      await dispatch(deleteProductById(productId) as any);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleAddProduct = async (formData: ProductForm) => {
    try {
      // Prepare payload for API
      const payload = {
        name: formData.name,
        title: formData.title,
        category: formData.category,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : 0,
        discount: formData.discount,
        stockCount: formData.stockCount ? parseInt(formData.stockCount) : 0,
        inStock: formData.inStock,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        reviews: formData.reviews ? parseInt(formData.reviews) : 0,
        description: formData.description,
        features: formData.features,
        specifications: formData.specifications,
        label: formData.label,
        labelType: formData.labelType,
        backgroundColor: "#1f2937",
        images: formData.images,
      };

      if (editProductId) {
        await dispatch(
          updateProductById({ id: editProductId, productData: payload }) as any
        );
        toast.success("Product updated successfully");
      } else {
        const result = await dispatch(createProduct(payload) as any);
        console.log("Product creation result:", result);
        toast.success("Product created successfully");

        // Refresh products to ensure they're up to date
        dispatch(fetchProducts() as any);
      }

      setIsModalOpen(false);
      setEditProductId(null);
      setForm({
        name: "",
        title: "",
        category: "",
        price: "",
        originalPrice: "",
        discount: "",
        stockCount: "",
        inStock: true,
        rating: "",
        reviews: "",
        description: "",
        features: [],
        specifications: {},
        label: "",
        labelType: "",
        images: [],
      });
    } catch (error) {
      console.error("Product creation error:", error);
      toast.error("Failed to save product");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Tab configuration
  const tabs = [
    { id: "products", label: "Product Management", icon: FaBox },
    { id: "wishlist", label: "My Wishlist", icon: FaHeart },
    { id: "slider", label: "Hero Slider", icon: FaImages },
    { id: "settings", label: "Store Settings", icon: FaCog },
  ];

  // Move summaryCards inside the component to use products.length and analytics
  const summaryCards = [
    {
      label: "Total Products",
      value: products.length.toLocaleString(),
      icon: <FaBox className="text-blue-400 text-2xl" />,
    },
    {
      label: "Total Orders",
      value: monthStats.totalOrders?.toLocaleString() ?? "-",
      icon: <FaUsers className="text-green-400 text-2xl" />,
    },
    {
      label: "Revenue",
      value: `₹${monthStats.revenue?.toLocaleString() ?? "-"}`,
      icon: <FaDollarSign className="text-yellow-400 text-2xl" />,
    },
    {
      label: "Growth",
      value: monthGrowth ?? "-",
      icon: <FaChartLine className="text-purple-400 text-2xl" />,
    },
  ];

  // Show loading spinner while data is being fetched
  if (loading || pageLoading || products.length === 0) {
    return (
      <div className="min-h-screen bg-black/90">
        <SimpleLoadingSpinner
          isLoading={true}
          message="Loading dashboard..."
          className="min-h-screen"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-5 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-400">{card.label}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
            {card.icon}
          </div>
        ))}
      </div>

      {/* Selected Date Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Date Image */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg">
              <div className="text-center text-white">
                <div className="text-4xl font-bold">
                  {(() => {
                    const savedDate = localStorage.getItem(
                      "retailerSelectedDate"
                    );
                    if (savedDate) {
                      const date = new Date(savedDate);
                      return date.getDate();
                    }
                    return new Date().getDate();
                  })()}
                </div>
                <div className="text-sm font-medium">
                  {(() => {
                    const savedDate = localStorage.getItem(
                      "retailerSelectedDate"
                    );
                    if (savedDate) {
                      const date = new Date(savedDate);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                      });
                    }
                    return new Date().toLocaleDateString("en-US", {
                      month: "short",
                    });
                  })()}
                </div>
              </div>
            </div>
            {/* Calendar icon overlay */}
            <div className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full p-2 shadow-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Date Information */}
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-xl font-bold text-white mb-2">
              Selected Date for Cart
            </h3>
            <p className="text-gray-300 mb-4">
              {(() => {
                const savedDate = localStorage.getItem("retailerSelectedDate");
                if (savedDate) {
                  const date = new Date(savedDate);
                  return date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                }
                return new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              })()}
            </p>

            {/* Cart Status */}
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-300">
                  {(() => {
                    const savedCart =
                      localStorage.getItem("retailerCartByDate");
                    const savedDate = localStorage.getItem(
                      "retailerSelectedDate"
                    );
                    if (savedCart && savedDate) {
                      const cartByDate = JSON.parse(savedCart);
                      const date = new Date(savedDate);
                      const formattedDate = date.toISOString().slice(0, 10);
                      const cartItems = cartByDate[formattedDate] || [];
                      const itemCount = cartItems.reduce(
                        (total: number, item: any) => total + item.quantity,
                        0
                      );
                      return `${itemCount} items in cart`;
                    }
                    return "No items in cart";
                  })()}
                </span>
              </div>

              <button
                onClick={() => (window.location.href = "/cart")}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                View Cart
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                const today = new Date();
                localStorage.setItem(
                  "retailerSelectedDate",
                  today.toISOString()
                );
                // Only reload if no error notification is shown
                // (No async error here, so reload is safe)
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex items-center justify-center"
              title="Set to Today"
              aria-label="Set to Today"
            >
              {/* Refresh Icon */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            <button
              onClick={() => (window.location.href = "/cart")}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
            >
              Manage Cart
            </button>
          </div>
        </div>
      </div>

      {/* Refresh Stats Button */}
      <div className="flex justify-end">
        <button
          onClick={manualRefreshStats}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          title="Refresh dashboard statistics"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh Stats
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-2 rounded-lg">
        <div className="flex space-x-1 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-red-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "products" && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <h2 className="text-xl font-bold text-white">Product Management</h2>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  setEditProductId(null);
                  setForm({
                    name: "",
                    title: "",
                    category: "",
                    price: "",
                    originalPrice: "",
                    discount: "",
                    stockCount: "",
                    inStock: true,
                    rating: "",
                    reviews: "",
                    description: "",
                    features: [],
                    specifications: {},
                    label: "",
                    labelType: "",
                    images: [],
                  });
                  setIsModalOpen(true);
                }}
                disabled={createLoading}
              >
                <FaPlus /> {createLoading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
            />
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="text-center py-8">
              <div className="text-white">Loading products...</div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="text-red-400">Error: {error}</div>
            </div>
          )}

          {/* Products Display */}
          {!loading && !error && (
            <div>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-gray-300">Product</th>
                      <th className="px-6 py-3 text-gray-300">Category</th>
                      <th className="px-6 py-3 text-gray-300">Price</th>
                      <th className="px-6 py-3 text-gray-300">Stock</th>
                      <th className="px-6 py-3 text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product, index) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-700 hover:bg-gray-700/30"
                      >
                        <td className="px-6 py-4 text-white">{product.name}</td>
                        <td className="px-6 py-4 text-gray-300">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 text-white">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {product.stockCount}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-400 hover:text-blue-300"
                              disabled={updateLoading}
                              title="Edit product"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-400 hover:text-red-300"
                              disabled={deleteLoading}
                              title="Delete product"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {paginatedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="bg-gray-700/30 border border-gray-600 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="flex items-start space-x-4 mb-3">
                      <div className="flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                            <FaBox className="text-gray-400 text-xl" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm truncate">
                          {product.name}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">
                          {product.category}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-white font-bold">
                            ₹{product.price}
                          </span>
                          <span className="text-gray-400 text-xs">
                            Stock: {product.stockCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-2 pt-2 border-t border-gray-600">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300"
                        disabled={updateLoading}
                        title="Edit product"
                      >
                        <FaEdit className="text-sm" />
                        <span>{updateLoading ? "Updating..." : "Edit"}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex items-center space-x-1 text-xs text-red-400 hover:text-red-300"
                        disabled={deleteLoading}
                        title="Delete product"
                      >
                        <FaTrash className="text-sm" />
                        <span>{deleteLoading ? "Deleting..." : "Delete"}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded ${
                          currentPage === i + 1
                            ? "bg-red-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "wishlist" && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center">
                <FaHeart className="h-5 w-5 mr-2 text-red-400 outline-2 outline-red-500 outline-offset-1" />{" "}
                Wishlist Analytics
              </h2>
              <p className="text-gray-400 mt-1">
                Overview of customer wishlist activity
              </p>
            </div>
            <button
              onClick={fetchWishlistAnalytics}
              disabled={analyticsLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {analyticsLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {analyticsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading analytics...</p>
            </div>
          ) : wishlistAnalytics ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">
                        Total Wishlist Items
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {wishlistAnalytics.summary.totalWishlistItems}
                      </p>
                    </div>
                    <FaHeart className="h-8 w-8 text-red-400 outline-2 outline-red-500 outline-offset-1" />
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Most Wished Item</p>
                      <p className="text-lg font-semibold text-white">
                        {wishlistAnalytics.summary.mostWishedItem
                          ?.productName || "-"}
                      </p>
                      {wishlistAnalytics.summary.mostWishedItem && (
                        <p className="text-sm text-gray-400">
                          {wishlistAnalytics.summary.mostWishedItem.wishCount}{" "}
                          wishes
                        </p>
                      )}
                    </div>
                    <FaHeart className="h-8 w-8 text-yellow-400 outline-2 outline-yellow-500 outline-offset-1" />
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Users</p>
                      <p className="text-2xl font-bold text-white">
                        {wishlistAnalytics.summary.activeUsers}
                      </p>
                      <p className="text-sm text-gray-400">
                        of {wishlistAnalytics.summary.totalCustomers} total
                      </p>
                    </div>
                    <FaUsers className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Recent Wishlist Activity
                  </h3>
                  {wishlistAnalytics.recentActivity.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {wishlistAnalytics.recentActivity.map(
                        (activity, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg"
                          >
                            <div>
                              <p className="text-white font-medium">
                                {activity.customerUsername}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {activity.productName}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {new Date(
                                  activity.addedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <FaHeart className="h-4 w-4 text-red-400 outline-2 outline-red-500 outline-offset-1" />
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaHeart className="h-12 w-12 text-gray-500 mx-auto mb-4 outline-2 outline-gray-500 outline-offset-1" />
                      <p className="text-gray-400">No recent activity</p>
                    </div>
                  )}
                </div>

                {/* Customer Stats */}
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Customer Statistics
                  </h3>
                  {wishlistAnalytics.customerStats.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {wishlistAnalytics.customerStats
                        .slice(0, 5)
                        .map((customer, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg"
                          >
                            <div>
                              <p className="text-white font-medium">
                                {customer.customerUsername}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {customer.totalWishlistItems} items •{" "}
                                {customer.loginCount} logins
                              </p>
                              <p className="text-gray-500 text-xs">
                                Last active:{" "}
                                {new Date(
                                  customer.lastWishlistActivity
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <FaUsers className="h-4 w-4 text-blue-400" />
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaUsers className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No customer data</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <FaHeart className="h-12 w-12 text-gray-500 mx-auto mb-4 outline-2 outline-gray-500 outline-offset-1" />
              <p className="text-gray-400">No analytics data available</p>
              <p className="text-gray-500 text-sm mt-2">
                Customer wishlist data will appear here when available
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "slider" && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <h2 className="text-xl font-bold text-white">
              Hero Slider Management
            </h2>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                onClick={async () => {
                  try {
                    const response = await fetch("/api/slider/seed", {
                      method: "POST",
                    });
                    const result = await response.json();
                    if (result.success) {
                      toast.success("Default slider images added successfully");
                      window.location.reload();
                    } else {
                      toast.error("Failed to add default images");
                    }
                  } catch (error) {
                    toast.error("Failed to add default images");
                  }
                }}
              >
                <FaPlus /> Add Default Images
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  setIsSliderManagerOpen(true);
                }}
              >
                <FaImages /> Manage Slider Images
              </button>
            </div>
          </div>
          <p className="text-gray-400">
            Upload, edit, and manage the images displayed in the hero slider on
            your homepage.
          </p>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg">
          <StoreSettings />
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProduct}
        form={form}
        setForm={setForm}
        loading={createLoading || updateLoading}
      />

      {/* Slider Manager Modal */}
      <SliderManager
        isOpen={isSliderManagerOpen}
        onClose={() => setIsSliderManagerOpen(false)}
      />

      {/* Cart & Miscellaneous Input */}
      {/* Removed: Cart for Selected Date section */}

      {/* Daily Analytics */}
      {/* Removed: Daily Analytics container */}

      {/* Monthly Analytics */}
      {/* Removed: Monthly Analytics container */}
    </div>
  );
};

export default RetailerDashboard;
