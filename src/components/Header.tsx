"use client";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  Phone,
  LogOut,
  Heart,
  ShoppingCart,
  Home as HomeIcon,
  List,
  MapPin,
  Info,
  User,
  LogIn,
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
import { selectCartItemCount } from "@/components/store/cartSlice";
import StoreSettingsWrapper from "@/components/StoreSettingsWrapper";
import { useTheme } from "./hooks/useTheme";
import ThemeToggle from "./ThemeToggle";
import gsap from "gsap";

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ReactElement;
  isLogout?: boolean;
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileOverlayRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const { getHeaderClasses, getClass, getClasses } = useTheme();

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn, username, role } = useSelector(
    (state: RootState) => state.user
  );
  const cartItemCount = useSelector(selectCartItemCount);
  const features = useSelector(selectFeatures);
  const pages = useSelector(selectPages);

  const getNavigation = (): NavigationItem[] => {
    const baseNav = [
      {
        name: "Home",
        href: "/",
        icon: <HomeIcon className="h-5 w-5" />,
      },
      {
        name: "All Products",
        href: "/product/allproducts",
        icon: <List className="h-5 w-5" />,
      },
      {
        name: "Wishlist",
        href: "/wishlist",
        icon: <Heart className="h-5 w-5" />,
      },
      {
        name: "Cart",
        href: "/cart",
        icon: <ShoppingCart className="h-5 w-5" />,
      },
    ];

    if (isLoggedIn) {
      baseNav.push({
        name: "Dashboard",
        href:
          role === "retailer" ? "/retailer-dashboard" : "/customer-dashboard",
        icon: <User className="h-5 w-5" />,
      });
      baseNav.push({
        name: "Logout",
        href: "#",
        icon: <LogOut className="h-5 w-5" />,
        isLogout: true,
      } as NavigationItem);
    } else {
      baseNav.push({
        name: "Login",
        href: "/auth",
        icon: <LogIn className="h-5 w-5" />,
      });
    }

    return baseNav;
  };

  const handleLogout = async () => {
    try {
      dispatch(logout());
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavigationClick = (item: NavigationItem) => {
    if (item.isLogout) {
      handleLogout();
    } else {
      router.push(item.href);
    }
    setIsMobileMenuOpen(false);
  };

  // Enhanced mobile menu animation with circular reveal
  const openMobileMenu = () => {
    if (!mobileButtonRef.current) return;

    const button = mobileButtonRef.current;

    // First, set the menu to open so the overlay renders
    setIsMobileMenuOpen(true);

    // Use setTimeout to ensure the overlay is rendered before animating
    setTimeout(() => {
      if (!mobileMenuRef.current || !mobileOverlayRef.current) return;

      const menu = mobileMenuRef.current;
      const overlay = mobileOverlayRef.current;

      // Get button position for circular reveal
      const buttonRect = button.getBoundingClientRect();
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;

      // Calculate the maximum distance to any corner
      const maxDistance = Math.max(
        Math.sqrt(buttonCenterX ** 2 + buttonCenterY ** 2),
        Math.sqrt(
          (window.innerWidth - buttonCenterX) ** 2 + buttonCenterY ** 2
        ),
        Math.sqrt(
          buttonCenterX ** 2 + (window.innerHeight - buttonCenterY) ** 2
        ),
        Math.sqrt(
          (window.innerWidth - buttonCenterX) ** 2 +
            (window.innerHeight - buttonCenterY) ** 2
        )
      );

      // Set initial state
      gsap.set(overlay, {
        clipPath: `circle(0px at ${buttonCenterX}px ${buttonCenterY}px)`,
        opacity: 0,
      });
      gsap.set(menu, {
        opacity: 0,
        scale: 0.8,
        rotationX: 15,
      });

      // Animate overlay with circular reveal
      gsap.to(overlay, {
        clipPath: `circle(${maxDistance}px at ${buttonCenterX}px ${buttonCenterY}px)`,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      });

      // Animate menu content
      gsap.to(menu, {
        opacity: 1,
        scale: 1,
        rotationX: 0,
        duration: 0.5,
        delay: 0.2,
        ease: "back.out(1.7)",
      });

      // Animate menu items with stagger
      const menuItems = menu.querySelectorAll("button");
      gsap.fromTo(
        menuItems,
        {
          opacity: 0,
          y: 20,
          scale: 0.8,
          rotationX: 15,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          stagger: 0.08,
          duration: 0.4,
          delay: 0.3,
          ease: "back.out(1.7)",
        }
      );
    }, 10); // Small delay to ensure DOM is updated
  };

  const closeMobileMenu = () => {
    if (
      !mobileMenuRef.current ||
      !mobileOverlayRef.current ||
      !mobileButtonRef.current
    )
      return;

    const button = mobileButtonRef.current;
    const menu = mobileMenuRef.current;
    const overlay = mobileOverlayRef.current;

    const buttonRect = button.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;

    // Animate menu items out
    const menuItems = menu.querySelectorAll("button");
    gsap.to(menuItems, {
      opacity: 0,
      y: -20,
      scale: 0.8,
      rotationX: -15,
      stagger: 0.05,
      duration: 0.3,
      ease: "power2.in",
    });

    // Animate menu out
    gsap.to(menu, {
      opacity: 0,
      scale: 0.8,
      rotationX: -15,
      duration: 0.4,
      delay: 0.1,
      ease: "power2.in",
    });

    // Animate overlay with circular collapse
    gsap.to(overlay, {
      clipPath: `circle(0px at ${buttonCenterX}px ${buttonCenterY}px)`,
      opacity: 0,
      duration: 0.5,
      delay: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setIsMobileMenuOpen(false);
      },
    });
  };

  const handleMobileMenuToggle = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const handleOverlayClick = () => {
    closeMobileMenu();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-b border-gray-800"
          : "bg-gradient-to-r from-red-900/90 to-red-800/90 backdrop-blur-sm"
      } ${getHeaderClasses()}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">
              MR<span className="text-red-400">BIKEMODZ</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {getNavigation().map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigationClick(item)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? "text-red-400 bg-red-900/20"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
                {item.name === "Cart" && cartItemCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right side - Theme toggle and mobile menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle className="hidden md:block" />

            {/* Mobile menu button */}
            <button
              ref={mobileButtonRef}
              onClick={handleMobileMenuToggle}
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        ref={mobileOverlayRef}
        className={`fixed inset-0 bg-black/90 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={handleOverlayClick}
      >
        <div
          ref={mobileMenuRef}
          className="absolute top-20 left-4 right-4 bg-gray-900/95 backdrop-blur-md rounded-lg border border-gray-700 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-4">
            {getNavigation().map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigationClick(item)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:scale-105 ${
                    pathname === item.href
                      ? "text-red-400 bg-red-900/20"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }
                `}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
                {item.name === "Cart" && cartItemCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Theme toggle in mobile menu */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <ThemeToggle className="w-full" showLabels />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
