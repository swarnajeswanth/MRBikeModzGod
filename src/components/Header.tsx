"use client";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  Phone,
  Mail,
  LogOut,
  Heart,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/components/store/UserSlice";
import { RootState } from "@/components/store";
import {
  selectFeatures,
  selectPages,
} from "@/components/store/storeSettingsSlice";
import StoreSettingsWrapper from "@/components/StoreSettingsWrapper";
import toast from "react-hot-toast";
import LoadingButton from "./Loaders/LoadingButton";

type NavigationItem =
  | { name: string; href: string; isLogout?: never }
  | { name: string; href: string; isLogout: boolean };

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const tubelightRef = useRef<HTMLDivElement>(null);
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();

  const { isLoggedIn, username, role, wishlist } = useSelector(
    (state: RootState) => state.user
  );

  // Mock cart items count - you can replace this with actual cart state
  const cartItemsCount = 0; // This should come from your cart state
  const features = useSelector(selectFeatures);
  const pages = useSelector(selectPages);
  const pathname = usePathname();

  // Dynamic navigation based on authentication status and store settings
  const getNavigation = (): NavigationItem[] => {
    const baseNav: NavigationItem[] = [];

    // Only add navigation items if the corresponding pages are enabled
    if (pages?.home) {
      baseNav.push({ name: "Home", href: "/" });
    }

    // Only show Products and Categories on the home route
    if (pathname === "/") {
      if (pages?.allProducts) {
        baseNav.push({ name: "Products", href: "#products" });
      }
      if (features?.categories) {
        baseNav.push({ name: "Categories", href: "#categories" });
      }
    }

    baseNav.push({ name: "Store Location", href: "#store-location" });
    baseNav.push({ name: "About", href: "#footer" });
    baseNav.push({ name: "Contact", href: "#footer" });

    if (isLoggedIn) {
      if (pages?.customerDashboard) {
        baseNav.push({ name: "Dashboard", href: "/dashboard" });
      }
      baseNav.push({
        name: `Logout (${username})`,
        href: "#logout",
        isLogout: true,
      });
    } else {
      if (pages?.auth) {
        baseNav.push({ name: "Login", href: "/auth" });
      }
    }

    return baseNav;
  };

  const navigation = getNavigation();

  // Handle logout
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(logout());
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to logout");
    } finally {
      setLogoutLoading(false);
    }
  };

  // Match current path with nav
  useEffect(() => {
    const index = navigation.findIndex((item) =>
      pathname === "/" ? item.href === "/" : pathname.includes(item.href)
    );
    if (index !== -1) setActiveIndex(index);
  }, [pathname, navigation]);

  useEffect(() => {
    const activeLink = navRefs.current[activeIndex];
    const tubelight = tubelightRef.current;

    if (activeLink && tubelight) {
      const { offsetLeft, offsetWidth } = activeLink;

      tubelight.style.left = `${offsetLeft + offsetWidth / 2}px`;
      tubelight.style.width = `${offsetWidth}px`;
      tubelight.style.transform = "translateX(-50%)";
    }
  }, [activeIndex, isMenuOpen]);

  return (
    <header className="relative bg-black/90 backdrop-blur-sm border-b border-red-600/20 z-50">
      {/* Top Bar */}
      {/* <div className="bg-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex gap-4">
            <span className="flex items-center">
              <Phone className="h-4 w-4 mr-1" /> +1 (555) 123-4567
            </span>
            <span className="flex items-center">
              <Mail className="h-4 w-4 mr-1" /> info@mrbikemodz.com
            </span>
          </div>
          <span className="hidden md:block">
            Free Shipping on Orders Over $99!
          </span>
        </div>
      </div> */}

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">
          MR<span className="text-red-600">BIKEMODZ</span>
          <div className="text-xs text-gray-400 hidden sm:block">
            AUTO SPARE & ACCESSORIES
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative hidden md:flex items-center space-x-8">
          {navigation.map((item, index) => (
            <div key={item.name}>
              {item.isLogout ? (
                <LoadingButton
                  onClick={handleLogout}
                  loading={logoutLoading}
                  loadingText="Logging out..."
                  variant="secondary"
                  size="sm"
                  className="flex items-center text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-red-400 bg-transparent border-none shadow-none"
                  icon={<LogOut className="h-4 w-4 mr-1" />}
                >
                  Logout
                </LoadingButton>
              ) : (
                <Link
                  href={item.href}
                  ref={(el) => {
                    navRefs.current[index] = el;
                  }}
                  onClick={() => setActiveIndex(index)}
                  className={`relative text-sm font-medium transition-colors duration-200 ${
                    index === activeIndex
                      ? "text-red-400"
                      : "text-gray-300 hover:text-red-400"
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}

          {/* Cart Icon - Only show if add to cart feature is enabled */}
          <StoreSettingsWrapper feature="addToCart">
            <Link
              href="/cart"
              className="relative text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-red-400"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </StoreSettingsWrapper>

          {/* Wishlist Icon - Only show if wishlist feature is enabled */}
          <StoreSettingsWrapper feature="wishlist">
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="relative text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-red-400"
              >
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}
          </StoreSettingsWrapper>

          {/* Tubelight */}
          <div
            ref={tubelightRef}
            className="absolute bottom-0 h-[3px] bg-white transition-all duration-300 ease-out rounded-full"
          />
        </nav>

        {/* Mobile menu icon */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 px-4 pb-4">
          {navigation.map((item, index) => (
            <div key={item.name}>
              {item.isLogout ? (
                <LoadingButton
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  loading={logoutLoading}
                  loadingText="Logging out..."
                  variant="secondary"
                  size="sm"
                  className="flex items-center w-full py-2 font-medium transition-colors text-gray-300 hover:text-red-400 bg-transparent border-none shadow-none"
                  icon={<LogOut className="h-4 w-4 mr-2" />}
                >
                  Logout
                </LoadingButton>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsMenuOpen(false);
                  }}
                  className={`block py-2 font-medium transition-colors ${
                    index === activeIndex
                      ? "text-red-400"
                      : "text-gray-300 hover:text-red-400"
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}

          {/* Mobile Cart */}
          <StoreSettingsWrapper feature="addToCart">
            <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center py-2 font-medium transition-colors text-gray-300 hover:text-red-400"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {cartItemsCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </StoreSettingsWrapper>

          {/* Mobile Wishlist */}
          <StoreSettingsWrapper feature="wishlist">
            {isLoggedIn && (
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center py-2 font-medium transition-colors text-gray-300 hover:text-red-400"
              >
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
                {wishlist.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}
          </StoreSettingsWrapper>
        </div>
      )}
    </header>
  );
};

export default Header;
