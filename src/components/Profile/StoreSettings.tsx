"use client";
/**
 * Store Settings Component
 *
 * This component allows store administrators to control which features are available to customers.
 * When features are disabled, they are completely hidden from the customer interface.
 *
 * HOW FEATURE CONTROLS WORK:
 *
 * 1. FEATURES TAB - Controls specific functionality:
 *    - addToCart: Hides "Add to Cart" buttons throughout the store
 *    - wishlist: Hides wishlist functionality and buttons
 *    - reviews: Hides review forms and review display
 *    - ratings: Hides star ratings on products
 *    - search: Hides search functionality
 *    - filters: Hides product filtering options
 *    - categories: Hides category navigation and browsing
 *    - productImages: Hides product images, shows placeholder
 *    - productDetails: Hides detailed product information
 *    - priceDisplay: Hides all price information
 *    - stockDisplay: Hides stock availability information
 *    - discountDisplay: Hides discount badges and promotions
 *    - relatedProducts: Hides "related products" sections
 *    - shareProducts: Hides social media sharing buttons
 *
 * 2. PAGES TAB - Controls page access:
 *    - home: Restricts access to homepage
 *    - allProducts: Restricts access to product listing pages
 *    - individualProduct: Restricts access to product detail pages
 *    - category: Restricts access to category pages
 *    - wishlist: Restricts access to wishlist page
 *    - cart: Restricts access to shopping cart
 *    - customerDashboard: Restricts access to customer dashboard
 *    - auth: Restricts access to login/registration pages
 *
 * 3. CUSTOMER EXPERIENCE TAB - Controls user experience:
 *    - allowGuestBrowsing: Requires login for all browsing
 *    - requireLoginForPurchase: Requires login before purchase
 *    - requireLoginForWishlist: Requires login to use wishlist
 *    - showPrices: Hides prices from all customers
 *    - showStock: Hides stock information from customers
 *    - allowProductSharing: Disables social media sharing
 *    - enableNotifications: Disables customer notifications
 *
 * IMPLEMENTATION IN COMPONENTS:
 *
 * To use these settings in your components, wrap them with StoreSettingsWrapper:
 *
 * ```tsx
 * import { StoreSettingsWrapper } from "@/components/StoreSettingsWrapper";
 *
 * <StoreSettingsWrapper feature="wishlist">
 *   <WishlistComponent />
 * </StoreSettingsWrapper>
 *
 * <StoreSettingsWrapper feature="addToCart">
 *   <AddToCartButton />
 * </StoreSettingsWrapper>
 * ```
 *
 * Or use the selectIsFeatureEnabled selector directly:
 *
 * ```tsx
 * import { useSelector } from "react-redux";
 * import { selectIsFeatureEnabled } from "@/components/store/storeSettingsSlice";
 *
 * const isWishlistEnabled = useSelector(selectIsFeatureEnabled("wishlist"));
 *
 * if (!isWishlistEnabled) {
 *   return <DisabledFeatureMessage />;
 * }
 * ```
 *
 * VISUAL FEEDBACK:
 * - Icons change dynamically based on enabled/disabled state
 * - Color-coded borders and backgrounds indicate status
 * - Real-time text updates show current state
 * - Smooth transitions provide visual feedback
 */

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
  initialState,
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
  MinusCircle,
  Heart,
  HeartOff,
  Star,
  StarOff,
  Search,
  X,
  Filter,
  Slash,
  Grid,
  Square,
  Image,
  ImageOff,
  FileText,
  FileX,
  DollarSign,
  Package,
  Tag,
  Share,
  Share2,
  Home,
  User,
  Lock,
  Eye,
  EyeOff,
  Bell,
  BellOff,
  Globe,
  Palette,
  Wrench,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Play,
  Pause,
  Zap,
  ZapOff,
  MessageCircle,
  MessageSquare,
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

  const handleToggleFeature = async (
    feature: keyof typeof currentSettings.features
  ) => {
    const currentState = currentSettings.features[feature];
    const newState = !currentState;

    // Update Redux state first
    dispatch(toggleFeature(feature));

    // Save to database and broadcast to other instances
    try {
      // Create updated features object with the new state
      const updatedFeatures = {
        ...currentSettings.features,
        [feature]: newState,
      };

      await dispatch(updateStoreSettings({ features: updatedFeatures }) as any);

      // Broadcast update to other instances
      if ((window as any).broadcastDataUpdate) {
        console.log("Broadcasting store settings update to other instances");
        (window as any).broadcastDataUpdate("STORE_SETTINGS_UPDATED");
      } else {
        console.log(
          "Broadcast function not available - WebSocket may not be connected"
        );
      }

      console.log(`Feature ${feature}: ${currentState} -> ${newState}`);
      toast.success(`${feature} ${newState ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Failed to update store settings:", error);
      toast.error("Failed to update store settings");
    }
  };

  const handleTogglePageAccess = async (
    page: keyof typeof currentSettings.pages
  ) => {
    const currentState = currentSettings.pages[page];
    const newState = !currentState;

    // Update Redux state first
    dispatch(togglePageAccess(page));

    // Save to database and broadcast to other instances
    try {
      // Create updated pages object with the new state
      const updatedPages = {
        ...currentSettings.pages,
        [page]: newState,
      };

      await dispatch(updateStoreSettings({ pages: updatedPages }) as any);

      // Broadcast update to other instances
      if ((window as any).broadcastDataUpdate) {
        console.log("Broadcasting store settings update to other instances");
        (window as any).broadcastDataUpdate("STORE_SETTINGS_UPDATED");
      } else {
        console.log(
          "Broadcast function not available - WebSocket may not be connected"
        );
      }

      console.log(`Page ${page}: ${currentState} -> ${newState}`);
      toast.success(`${page} page ${newState ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Failed to update store settings:", error);
      toast.error("Failed to update store settings");
    }
  };

  const handleToggleCustomerExperience = async (
    setting: keyof typeof currentSettings.customerExperience
  ) => {
    const currentState = currentSettings.customerExperience[setting];
    const newState = !currentState;

    // Update Redux state first
    dispatch(toggleCustomerExperience(setting));

    // Save to database and broadcast to other instances
    try {
      // Create updated customer experience object with the new state
      const updatedCustomerExperience = {
        ...currentSettings.customerExperience,
        [setting]: newState,
      };

      await dispatch(
        updateStoreSettings({
          customerExperience: updatedCustomerExperience,
        }) as any
      );

      // Broadcast update to other instances
      if ((window as any).broadcastDataUpdate) {
        console.log("Broadcasting store settings update to other instances");
        (window as any).broadcastDataUpdate("STORE_SETTINGS_UPDATED");
      } else {
        console.log(
          "Broadcast function not available - WebSocket may not be connected"
        );
      }

      console.log(
        `Customer Experience ${setting}: ${currentState} -> ${newState}`
      );
      toast.success(`${setting} ${newState ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Failed to update store settings:", error);
      toast.error("Failed to update store settings");
    }
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

      // Broadcast update to other instances
      if ((window as any).broadcastDataUpdate) {
        console.log("Broadcasting store settings update to other instances");
        (window as any).broadcastDataUpdate("STORE_SETTINGS_UPDATED");
      } else {
        console.log(
          "Broadcast function not available - WebSocket may not be connected"
        );
      }

      toast.success("Store information updated successfully");
    } catch (error) {
      toast.error("Failed to update store information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (
      window.confirm("Are you sure you want to reset all settings to defaults?")
    ) {
      dispatch(resetToDefaults());

      // Save to database and broadcast to other instances
      try {
        await dispatch(updateStoreSettings(initialState) as any);

        // Broadcast update to other instances
        if ((window as any).broadcastDataUpdate) {
          console.log("Broadcasting store settings update to other instances");
          (window as any).broadcastDataUpdate("STORE_SETTINGS_UPDATED");
        } else {
          console.log(
            "Broadcast function not available - WebSocket may not be connected"
          );
        }

        toast.success("Settings reset to defaults");
      } catch (error) {
        console.error("Failed to reset store settings:", error);
        toast.error("Failed to reset store settings");
      }
    }
  };

  // Dynamic feature icons that change based on state
  const getFeatureIcon = (feature: string, enabled: boolean) => {
    const iconMap: { [key: string]: { enabled: any; disabled: any } } = {
      addToCart: { enabled: ShoppingCart, disabled: MinusCircle },
      wishlist: { enabled: Heart, disabled: HeartOff },
      reviews: { enabled: Star, disabled: StarOff },
      ratings: { enabled: Star, disabled: StarOff },
      search: { enabled: Search, disabled: X },
      filters: { enabled: Filter, disabled: Slash },
      categories: { enabled: Grid, disabled: Square },
      productImages: { enabled: Image, disabled: ImageOff },
      productDetails: { enabled: FileText, disabled: FileX },
      priceDisplay: { enabled: DollarSign, disabled: X },
      stockDisplay: { enabled: Package, disabled: X },
      discountDisplay: { enabled: Tag, disabled: X },
      relatedProducts: { enabled: Grid, disabled: Square },
      shareProducts: { enabled: Share, disabled: Share2 },
    };

    const icons = iconMap[feature];
    return enabled ? icons.enabled : icons.disabled;
  };

  // Dynamic page icons that change based on state
  const getPageIcon = (page: string, enabled: boolean) => {
    const iconMap: { [key: string]: { enabled: any; disabled: any } } = {
      home: { enabled: Home, disabled: X },
      allProducts: { enabled: ShoppingCart, disabled: X },
      individualProduct: { enabled: FileText, disabled: FileX },
      category: { enabled: Grid, disabled: Square },
      wishlist: { enabled: Heart, disabled: HeartOff },
      cart: { enabled: ShoppingCart, disabled: MinusCircle },
      customerDashboard: { enabled: User, disabled: X },
      auth: { enabled: Lock, disabled: X },
    };

    const icons = iconMap[page];
    return enabled ? icons.enabled : icons.disabled;
  };

  // Dynamic customer experience icons that change based on state
  const getCustomerExperienceIcon = (setting: string, enabled: boolean) => {
    const iconMap: { [key: string]: { enabled: any; disabled: any } } = {
      allowGuestBrowsing: { enabled: Eye, disabled: EyeOff },
      requireLoginForPurchase: { enabled: Lock, disabled: X },
      requireLoginForWishlist: { enabled: Lock, disabled: X },
      showPrices: { enabled: DollarSign, disabled: X },
      showStock: { enabled: Package, disabled: X },
      allowProductSharing: { enabled: Share, disabled: Share2 },
      enableNotifications: { enabled: Bell, disabled: BellOff },
      enableWhatsAppChat: { enabled: MessageCircle, disabled: MessageSquare },
    };

    const icons = iconMap[setting];
    return enabled ? icons.enabled : icons.disabled;
  };

  // Feature descriptions for better UX
  const getFeatureDescription = (feature: string) => {
    const descriptions: { [key: string]: string } = {
      addToCart: "Allow customers to add products to cart",
      wishlist: "Enable wishlist functionality for customers",
      reviews: "Allow customers to write product reviews",
      ratings: "Show product ratings and stars",
      search: "Enable product search functionality",
      filters: "Allow filtering products by various criteria",
      categories: "Show product categories and navigation",
      productImages: "Display product images and galleries",
      productDetails: "Show detailed product information",
      priceDisplay: "Display product prices to customers",
      stockDisplay: "Show product stock availability",
      discountDisplay: "Display discounts and promotions",
      relatedProducts: "Show related product suggestions",
      shareProducts: "Allow sharing products on social media",
    };
    return descriptions[feature] || feature;
  };

  // Page descriptions
  const getPageDescription = (page: string) => {
    const descriptions: { [key: string]: string } = {
      home: "Main store homepage",
      allProducts: "Browse all products page",
      individualProduct: "Individual product detail pages",
      category: "Product category pages",
      wishlist: "Customer wishlist page",
      cart: "Shopping cart page",
      customerDashboard: "Customer account dashboard",
      auth: "Login and registration pages",
    };
    return descriptions[page] || page;
  };

  // Customer experience descriptions
  const getCustomerExperienceDescription = (setting: string) => {
    const descriptions: { [key: string]: string } = {
      allowGuestBrowsing: "Allow browsing without login",
      requireLoginForPurchase: "Require login to make purchases",
      requireLoginForWishlist: "Require login to use wishlist",
      showPrices: "Display prices to all customers",
      showStock: "Show stock availability to customers",
      allowProductSharing: "Allow sharing products on social media",
      enableNotifications: "Send notifications to customers",
      enableWhatsAppChat: "Show WhatsApp chat button for customer support",
    };
    return descriptions[setting] || setting;
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
                    const Icon = getFeatureIcon(feature, enabled);
                    return (
                      <div
                        key={feature}
                        className={`bg-gray-700 p-3 sm:p-4 rounded-lg flex items-center justify-between transition-all duration-200 hover:bg-gray-600 ${
                          enabled
                            ? "border-l-4 border-green-500"
                            : "border-l-4 border-gray-500"
                        }`}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <div
                            className={`p-2 rounded-lg ${
                              enabled ? "bg-green-500/20" : "bg-gray-500/20"
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                enabled ? "text-green-400" : "text-gray-400"
                              } flex-shrink-0`}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium capitalize text-sm sm:text-base truncate">
                              {feature.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm truncate">
                              {getFeatureDescription(feature)}
                            </p>
                            <div className="flex items-center space-x-1 mt-1">
                              {enabled ? (
                                <CheckCircle className="h-3 w-3 text-green-400" />
                              ) : (
                                <XCircle className="h-3 w-3 text-gray-400" />
                              )}
                              <span
                                className={`text-xs ${
                                  enabled ? "text-green-400" : "text-gray-400"
                                }`}
                              >
                                {enabled ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleToggleFeature(
                              feature as keyof typeof currentSettings.features
                            )
                          }
                          className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                            enabled
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-gray-600 hover:bg-gray-500 text-white"
                          }`}
                        >
                          {enabled ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
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
                    const Icon = getPageIcon(page, enabled);
                    return (
                      <div
                        key={page}
                        className={`bg-gray-700 p-3 sm:p-4 rounded-lg flex items-center justify-between transition-all duration-200 hover:bg-gray-600 ${
                          enabled
                            ? "border-l-4 border-blue-500"
                            : "border-l-4 border-gray-500"
                        }`}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <div
                            className={`p-2 rounded-lg ${
                              enabled ? "bg-blue-500/20" : "bg-gray-500/20"
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                enabled ? "text-blue-400" : "text-gray-400"
                              } flex-shrink-0`}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium capitalize text-sm sm:text-base truncate">
                              {page.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm truncate">
                              {getPageDescription(page)}
                            </p>
                            <div className="flex items-center space-x-1 mt-1">
                              {enabled ? (
                                <CheckCircle className="h-3 w-3 text-blue-400" />
                              ) : (
                                <XCircle className="h-3 w-3 text-gray-400" />
                              )}
                              <span
                                className={`text-xs ${
                                  enabled ? "text-blue-400" : "text-gray-400"
                                }`}
                              >
                                {enabled ? "Accessible" : "Restricted"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleTogglePageAccess(
                              page as keyof typeof currentSettings.pages
                            )
                          }
                          className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                            enabled
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-600 hover:bg-gray-500 text-white"
                          }`}
                        >
                          {enabled ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
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
                    const Icon = getCustomerExperienceIcon(setting, enabled);
                    return (
                      <div
                        key={setting}
                        className={`bg-gray-700 p-3 sm:p-4 rounded-lg flex items-center justify-between transition-all duration-200 hover:bg-gray-600 ${
                          enabled
                            ? "border-l-4 border-yellow-500"
                            : "border-l-4 border-gray-500"
                        }`}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <div
                            className={`p-2 rounded-lg ${
                              enabled ? "bg-yellow-500/20" : "bg-gray-500/20"
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                enabled ? "text-yellow-400" : "text-gray-400"
                              } flex-shrink-0`}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium capitalize text-sm sm:text-base truncate">
                              {setting.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm truncate">
                              {getCustomerExperienceDescription(setting)}
                            </p>
                            <div className="flex items-center space-x-1 mt-1">
                              {enabled ? (
                                <CheckCircle className="h-3 w-3 text-yellow-400" />
                              ) : (
                                <XCircle className="h-3 w-3 text-gray-400" />
                              )}
                              <span
                                className={`text-xs ${
                                  enabled ? "text-yellow-400" : "text-gray-400"
                                }`}
                              >
                                {enabled ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleToggleCustomerExperience(
                              setting as keyof typeof currentSettings.customerExperience
                            )
                          }
                          className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                            enabled
                              ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                              : "bg-gray-600 hover:bg-gray-500 text-white"
                          }`}
                        >
                          {enabled ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
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
