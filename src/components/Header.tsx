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
import toast from "react-hot-toast";
import LoadingButton from "./Loaders/LoadingButton";
import {
  AnimatedHomeIcon,
  AnimatedCartIcon,
  AnimatedListIcon,
  AnimatedMapPinIcon,
  AnimatedInfoIcon,
  AnimatedMailIcon,
  AnimatedUserIcon,
  AnimatedLogInIcon,
  AnimatedLogOutIcon,
  AnimatedHeartIcon,
  AnimatedShoppingCartIcon,
} from "./AnimatedIcons";

type NavigationItem =
  | { name: string; href: string; icon: React.ReactNode; isLogout?: never }
  | { name: string; href: string; icon: React.ReactNode; isLogout: boolean };

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
  const pathname = usePathname();

  const isHome = pathname === "/";

  const getNavigation = (): NavigationItem[] => {
    const baseNav = [
      {
        name: "Home",
        href: "/",
        icon: <AnimatedHomeIcon className="h-4 w-4 mr-2" />,
      });
    }

    if (pathname === "/") {
      if (pages?.allProducts) {
        baseNav.push({
          name: "Products",
          href: "#products",
          icon: <AnimatedCartIcon className="h-4 w-4 mr-2" />,
        });
      }
      if (features?.categories) {
        baseNav.push({
          name: "Categories",
          href: "#categories",
          icon: <AnimatedListIcon className="h-4 w-4 mr-2" />,
        });
      }
      baseNav.push({
        name: "Store Location",
        href: "#store-location",
        icon: <AnimatedMapPinIcon className="h-4 w-4 mr-2" />,
      });
      baseNav.push({
        name: "About",
        href: "#footer",
        icon: <AnimatedInfoIcon className="h-4 w-4 mr-2" />,
      });
    }

    baseNav.push({
      name: "Contact",
      href: "#footer",
      icon: <AnimatedMailIcon className="h-4 w-4 mr-2" />,
    });

    if (isLoggedIn) {
      if (pages?.customerDashboard) {
        baseNav.push({
          name: "Dashboard",
          href: "/dashboard",
          icon: <AnimatedUserIcon className="h-4 w-4 mr-2" />,
        });
      }
      baseNav.push({
        name: `Logout (${username})`,
        href: "#logout",
        icon: <AnimatedLogOutIcon className="h-4 w-4 mr-2" />,
        isLogout: true,
      } as NavigationItem);
    } else {
      if (pages?.auth) {
        baseNav.push({
          name: "Login",
          href: "/auth",
          icon: <AnimatedLogInIcon className="h-4 w-4 mr-2" />,
        });
      }
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
    <header className="sticky top-0 bg-black/90 backdrop-blur-sm border-b border-red-600/20 z-50">
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
                  className={`flex items-center text-sm font-medium transition-colors ${
                    isHome ? "duration-100" : "duration-200"
                  } text-gray-300 hover:text-red-400 bg-transparent border-none shadow-none p-0`}
                  icon={item.icon}
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
                  className={`relative flex items-center text-sm font-medium transition-colors ${
                    isHome ? "duration-100" : "duration-200"
                  } ${
                    index === activeIndex
                      ? "text-red-400"
                      : "text-gray-300 hover:text-red-400"
                  }`}
                >
                  {item.icon}
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
              <AnimatedShoppingCartIcon className="h-5 w-5" />
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
                <AnimatedHeartIcon
                  className="h-5 w-5"
                  filled={wishlist.length > 0}
                />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlist.length}
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

      {/* Mobile Nav */}
      <div
        className={`md:hidden bg-black/95 px-4 pb-4 overflow-hidden transition-all ${
          isHome ? "duration-300" : "duration-500"
        } ease-in-out ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="py-4 space-y-2">
          {navigation.map((item, index) => (
            <div
              key={item.name}
              className={`transform transition-all ${
                isHome ? "duration-100" : "duration-300"
              } ease-out ${
                isMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
                transform: isMenuOpen ? "translateX(0)" : "translateX(100%)",
              }}
            >
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
                  className="flex items-center w-full py-3 pl-0 font-medium transition-all duration-200 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg px-3 bg-transparent border-none shadow-none justify-start"
                  icon={item.icon}
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
                  className={`block flex items-center py-3 px-3 font-medium transition-all duration-200 rounded-lg ${
                    index === activeIndex
                      ? "text-red-400 bg-red-500/10"
                      : "text-gray-300 hover:text-red-400 hover:bg-red-500/10"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )}
            </div>
          ))}

          {/* Mobile Cart */}
          <StoreSettingsWrapper feature="addToCart">
            <div
              className={`transform transition-all duration-300 ease-out ${
                isMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
              style={{
                transitionDelay: `${navigation.length * 100}ms`,
                transform: isMenuOpen ? "translateX(0)" : "translateX(100%)",
              }}
            >
              <Link
                href="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center py-3 px-3 font-medium transition-all duration-200 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
              >
                <AnimatedShoppingCartIcon className="h-4 w-4 mr-2" />
                Cart
                {cartItemsCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </StoreSettingsWrapper>

          {/* Mobile Wishlist */}
          <StoreSettingsWrapper feature="wishlist">
            {isLoggedIn && (
              <div
                className={`transform transition-all duration-300 ease-out ${
                  isMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                }`}
                style={{
                  transitionDelay: `${(navigation.length + 1) * 100}ms`,
                  transform: isMenuOpen ? "translateX(0)" : "translateX(100%)",
                }}
              >
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center py-3 px-3 font-medium transition-all duration-200 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  <AnimatedHeartIcon
                    className="h-4 w-4 mr-2"
                    filled={wishlist.length > 0}
                  />
                  Wishlist
                  {wishlist.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
              </div>
            )}
          </StoreSettingsWrapper>
        </div>
      </div>
    </header>
  );
};

export default Header;
