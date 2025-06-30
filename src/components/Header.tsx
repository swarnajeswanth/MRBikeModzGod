"use client";
import { useState } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
// import { Button } from "@*/components/ui/button"4;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "#" },
    { name: "Products", href: "#products" },
    { name: "Categories", href: "#categories" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="relative bg-black/90 backdrop-blur-sm border-b border-red-600/20">
      {/* Top Bar */}
      <div className="bg-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@mrbikemodz.com</span>
              </div>
            </div>
            <div className="hidden md:block">
              <span>Free Shipping on Orders Over $99!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-white">
              MR<span className="text-red-600">BIKEMODZ</span>
            </div>
            <div className="ml-2 text-xs text-gray-400 hidden sm:block">
              AUTO SPARE & ACCESSORIES
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-red-400 transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden relative z-50">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:text-red-400 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-red-400"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div> */}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-red-600/20">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-gray-300 hover:text-red-400 transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
