"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "#products" },
  { name: "Categories", href: "#categories" },
  { name: "About", href: "#footer" },
  { name: "Contact", href: "#footer" },
  { name: "Login", href: "/auth" },
  { name: "Retailer", href: "/retailer-dashboard" },
  { name: "Customer", href: "/customer-dashboard" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const tubelightRef = useRef<HTMLDivElement>(null);
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const pathname = usePathname();

  // Match current path with nav
  useEffect(() => {
    const index = navigation.findIndex((item) =>
      pathname === "/" ? item.href === "/" : pathname.includes(item.href)
    );
    if (index !== -1) setActiveIndex(index);
  }, [pathname]);

  useEffect(() => {
    const activeLink = navRefs.current[activeIndex];
    const tubelight = tubelightRef.current;

    if (activeLink && tubelight) {
      const { offsetLeft, offsetWidth } = activeLink;

      tubelight.style.left = `${offsetLeft + offsetWidth / 2}px`;
      tubelight.style.width = `${offsetWidth}px`; // ✅ Make tubelight width match the text
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
            <Link
              key={item.name}
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
          ))}

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
            <Link
              key={item.name}
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
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
