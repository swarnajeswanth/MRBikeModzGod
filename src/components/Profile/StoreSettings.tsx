"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/components/store";
import {
  selectStoreSettings,
  updateStoreSettings,
  toggleFeature,
  togglePageAccess,
  toggleCustomerExperience,
  updateStoreInfo,
  resetToDefaults,
} from "@/components/store/storeSettingsSlice";
import {
  Settings,
  ToggleLeft,
  ToggleRight,
  Save,
  RotateCcw,
  Store,
  Users,
  Shield,
  ShoppingCart,
  Heart,
  Star,
  Search,
  Filter,
  Grid,
  Image,
  FileText,
  DollarSign,
  Package,
  Tag,
  Share,
  Home,
  ShoppingBag,
  User,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Globe,
  Palette,
  Wrench,
} from "lucide-react";
import { toast } from "react-hot-toast";

const StoreSettings = () => {
  const dispatch = useDispatch();
  const storeSettings = useSelector(selectStoreSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("features");

  // Local state for form inputs
  const [storeInfo, setStoreInfo] = useState(
    storeSettings?.storeInfo || {
      name: "MrBikeModzGod",
      description: "Premium bike parts and accessories",
      logo: "",
      theme: "dark",
      maintenanceMode: false,
      maintenanceMessage:
        "Store is under maintenance. Please check back later.",
    }
  );

  useEffect(() => {
    if (storeSettings?.storeInfo) {
      setStoreInfo(storeSettings.storeInfo);
    }
  }, [storeSettings?.storeInfo]);

  // Use default settings if storeSettings is not available
  const currentSettings = storeSettings || {
    features: {
      addToCart: true,
      wishlist: true,
      reviews: true,
      ratings: true,
      search: true,
      filters: true,
      categories: true,
      productImages: true,
      productDetails: true,
      priceDisplay: true,
      stockDisplay: true,
      discountDisplay: true,
      relatedProducts: true,
      shareProducts: true,
    },
    pages: {
      home: true,
      allProducts: true,
      individualProduct: true,
      category: true,
      wishlist: true,
      cart: true,
      customerDashboard: true,
      auth: true,
    },
    storeInfo: {
      name: "MrBikeModzGod",
      description: "Premium bike parts and accessories",
      logo: "",
      theme: "dark",
      maintenanceMode: false,
      maintenanceMessage:
        "Store is under maintenance. Please check back later.",
    },
    customerExperience: {
      allowGuestBrowsing: true,
      requireLoginForPurchase: true,
      requireLoginForWishlist: true,
      showPrices: true,
      showStock: true,
      allowProductSharing: true,
      enableNotifications: true,
    },
  };

  const handleToggleFeature = (
    feature: keyof typeof currentSettings.features
  ) => {
    dispatch(toggleFeature(feature));
    toast.success(
      `${feature} ${currentSettings.features[feature] ? "disabled" : "enabled"}`
    );
  };

  const handleTogglePageAccess = (page: keyof typeof currentSettings.pages) => {
    dispatch(togglePageAccess(page));
    toast.success(
      `${page} page ${currentSettings.pages[page] ? "disabled" : "enabled"}`
    );
  };

  const handleToggleCustomerExperience = (
    setting: keyof typeof currentSettings.customerExperience
  ) => {
    dispatch(toggleCustomerExperience(setting));
    toast.success(
      `${setting} ${
        currentSettings.customerExperience[setting] ? "disabled" : "enabled"
      }`
    );
  };

  const handleStoreInfoChange = (
    field: keyof typeof storeInfo,
    value: string | boolean
  ) => {
    setStoreInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveStoreInfo = async () => {
    setIsLoading(true);
    try {
      await dispatch(updateStoreSettings({ storeInfo }) as any);
      toast.success("Store information updated successfully");
    } catch (error) {
      toast.error("Failed to update store information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefaults = () => {
    if (
      window.confirm("Are you sure you want to reset all settings to defaults?")
    ) {
      dispatch(resetToDefaults());
      toast.success("Settings reset to defaults");
    }
  };

  const featureIcons = {
    addToCart: ShoppingCart,
    wishlist: Heart,
    reviews: Star,
    ratings: Star,
    search: Search,
    filters: Filter,
    categories: Grid,
    productImages: Image,
    productDetails: FileText,
    priceDisplay: DollarSign,
    stockDisplay: Package,
    discountDisplay: Tag,
    relatedProducts: Grid,
    shareProducts: Share,
  };

  const pageIcons = {
    home: Home,
    allProducts: ShoppingBag,
    individualProduct: FileText,
    category: Grid,
    wishlist: Heart,
    cart: ShoppingCart,
    customerDashboard: User,
    auth: Lock,
  };

  const customerExperienceIcons = {
    allowGuestBrowsing: Eye,
    requireLoginForPurchase: Lock,
    requireLoginForWishlist: Lock,
    showPrices: DollarSign,
    showStock: Package,
    allowProductSharing: Share,
    enableNotifications: Bell,
  };

  const tabs = [
    { id: "features", label: "Features", icon: Settings },
    { id: "pages", label: "Page Access", icon: Globe },
    { id: "customer", label: "Customer Experience", icon: Users },
    { id: "store", label: "Store Info", icon: Store },
  ];

  return (
    <div className="bg-gray-900 min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Store Settings
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Control customer experience, features, and page access
          </p>
        </div>

        {/* Tabs - Mobile Responsive */}
        <div className="bg-gray-800 p-1 rounded-lg mb-6 sm:mb-8">
          <div className="grid grid-cols-2 sm:flex sm:space-x-1 gap-1 sm:gap-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
          {/* Features Tab */}
          {activeTab === "features" && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
                Feature Controls
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(currentSettings.features).map(
                  ([feature, enabled]) => {
                    const Icon =
                      featureIcons[feature as keyof typeof featureIcons];
                    return (
                      <div
                        key={feature}
                        className="bg-gray-700 p-3 sm:p-4 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium capitalize text-sm sm:text-base truncate">
                              {feature.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm">
                              {enabled ? "Enabled" : "Disabled"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleToggleFeature(
                              feature as keyof typeof currentSettings.features
                            )
                          }
                          className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
                            enabled
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-600 hover:bg-gray-500"
                          }`}
                        >
                          {enabled ? (
                            <ToggleRight className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          ) : (
                            <ToggleLeft className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          )}
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Pages Tab */}
          {activeTab === "pages" && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
                Page Access Controls
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(currentSettings.pages).map(
                  ([page, enabled]) => {
                    const Icon = pageIcons[page as keyof typeof pageIcons];
                    return (
                      <div
                        key={page}
                        className="bg-gray-700 p-3 sm:p-4 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium capitalize text-sm sm:text-base truncate">
                              {page.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm">
                              {enabled ? "Accessible" : "Restricted"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleTogglePageAccess(
                              page as keyof typeof currentSettings.pages
                            )
                          }
                          className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
                            enabled
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-600 hover:bg-gray-500"
                          }`}
                        >
                          {enabled ? (
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          ) : (
                            <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          )}
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Customer Experience Tab */}
          {activeTab === "customer" && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
                Customer Experience
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(currentSettings.customerExperience).map(
                  ([setting, enabled]) => {
                    const Icon =
                      customerExperienceIcons[
                        setting as keyof typeof customerExperienceIcons
                      ];
                    return (
                      <div
                        key={setting}
                        className="bg-gray-700 p-3 sm:p-4 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium capitalize text-sm sm:text-base truncate">
                              {setting.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm">
                              {enabled ? "Enabled" : "Disabled"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleToggleCustomerExperience(
                              setting as keyof typeof currentSettings.customerExperience
                            )
                          }
                          className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
                            enabled
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-600 hover:bg-gray-500"
                          }`}
                        >
                          {enabled ? (
                            <ToggleRight className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          ) : (
                            <ToggleLeft className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          )}
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Store Info Tab */}
          {activeTab === "store" && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
                Store Information
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={storeInfo.name}
                      onChange={(e) =>
                        handleStoreInfoChange("name", e.target.value)
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                      Theme
                    </label>
                    <select
                      value={storeInfo.theme}
                      onChange={(e) =>
                        handleStoreInfoChange("theme", e.target.value)
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                    Description
                  </label>
                  <textarea
                    value={storeInfo.description}
                    onChange={(e) =>
                      handleStoreInfoChange("description", e.target.value)
                    }
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={storeInfo.logo}
                    onChange={(e) =>
                      handleStoreInfoChange("logo", e.target.value)
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={storeInfo.maintenanceMode}
                      onChange={(e) =>
                        handleStoreInfoChange(
                          "maintenanceMode",
                          e.target.checked
                        )
                      }
                      className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-white text-sm sm:text-base">
                      Maintenance Mode
                    </span>
                  </label>
                </div>

                {storeInfo.maintenanceMode && (
                  <div>
                    <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                      Maintenance Message
                    </label>
                    <textarea
                      value={storeInfo.maintenanceMessage}
                      onChange={(e) =>
                        handleStoreInfoChange(
                          "maintenanceMessage",
                          e.target.value
                        )
                      }
                      rows={2}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={handleSaveStoreInfo}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reset Button */}
        <div className="mt-4 sm:mt-6 flex justify-end">
          <button
            onClick={handleResetToDefaults}
            className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreSettings;
