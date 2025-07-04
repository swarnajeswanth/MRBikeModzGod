"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Phone, Mail, LogOut, Heart } from "lucide-react";
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

type NavigationItem =
  | { name: string; href: string; isLogout?: never }
  | { name: string; href: string; isLogout: boolean };

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const tubelightRef = useRef<HTMLDivElement>(null);
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();

  const { isLoggedIn, username, role, wishlist } = useSelector(
    (state: RootState) => state.user
  );
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
    if (pages?.allProducts) {
      baseNav.push({ name: "Products", href: "#products" });
    }
    if (features?.categories) {
      baseNav.push({ name: "Categories", href: "#categories" });
    }
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
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    router.push("/");
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
      <div className="bg-red-600 text-white py-2">
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
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
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
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-red-400"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
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
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full py-2 font-medium transition-colors text-gray-300 hover:text-red-400"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
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
