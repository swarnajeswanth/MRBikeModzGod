"use client";
import {
  Phone,
  Mail,
  MapPin,
  Code,
  Database,
  Globe,
  Smartphone,
} from "lucide-react";
import SocialMediaIcons from "./SocialMediaIcons";
import { useSelector } from "react-redux";
import {
  selectUniqueCategories,
  selectLoading,
} from "@/components/store/productSlice";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();
  const uniqueCategories = useSelector(selectUniqueCategories);
  const loading = useSelector(selectLoading);

  // Format categories for display (capitalize first letter)
  const formattedCategories = uniqueCategories.map(
    (category) => category.charAt(0).toUpperCase() + category.slice(1)
  );

  // Limit to 6 categories for footer display
  const displayCategories = formattedCategories.slice(0, 6);

  // Add a note if there are more categories than shown
  const hasMoreCategories = formattedCategories.length > 6;

  const footerSections = [
    {
      title: "Products",
      links:
        displayCategories.length > 0
          ? displayCategories
          : loading
          ? ["Loading...1", "Loading...2", "Loading...3"]
          : [
              "Engine Parts",
              "Exhaust Systems",
              "Suspension",
              "Brakes",
              "Electronics",
              "Body Parts",
            ],
    },
    {
      title: "Support",
      links: [
        "Installation Guide",
        "Warranty",
        "Returns",
        "FAQ",
        "Technical Support",
        "Live Chat",
      ],
    },
    {
      title: "Company",
      links: [
        "About Us",
        "Careers",
        "Press",
        "Partners",
        "Testimonials",
        "Blog",
      ],
    },
  ];

  return (
    <footer id="footer" className="bg-black border-t border-gray-800">
      {/* Developer Section */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-red-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">
                Developed by{" "}
                <span className="text-red-400">Jeswanth Swarna</span>
              </h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Full-stack developer specializing in modern web technologies and
              scalable applications
            </p>
            {/* Removed tech stack icons row here */}
            <div className="text-xs text-gray-500">
              Built with modern web technologies for optimal performance and
              user experience
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <div className="text-2xl font-bold text-white mb-2">
                  MR<span className="text-red-600">BIKEMODZ</span>
                </div>
                <p className="text-gray-400">
                  Your trusted partner for premium auto spare parts and
                  accessories. Quality, performance, and reliability guaranteed.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-400">
                  <Phone className="h-5 w-5 mr-3 text-red-400" />
                  <span>+91 6304187805</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Mail className="h-5 w-5 mr-3 text-red-400" />
                  <span>mrbikemodz@gmail.com</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="h-5 w-5 mr-3 text-red-400" />
                  <span>
                    Anitha, Uma, Maheswari tample, VRC Centre, Nellore, Andhra
                    Pradesh 524001
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6">
                <SocialMediaIcons
                  variant="default"
                  size="md"
                  className="text-gray-400"
                />
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-white font-semibold text-lg mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, idx) => (
                    <li key={link + idx}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (section.title === "Products") {
                            // Navigate to category page for product links
                            const categorySlug = link.toLowerCase();
                            router.push(`/category/${categorySlug}`);
                          }
                        }}
                        className="text-gray-400 hover:text-red-400 transition-colors duration-200 cursor-pointer"
                      >
                        {link.replace(/\.\.\.[0-9]+$/, "...")}
                      </a>
                    </li>
                  ))}
                  {section.title === "Products" && hasMoreCategories && (
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push("/categories");
                        }}
                        className="text-gray-400 hover:text-red-400 transition-colors duration-200 cursor-pointer text-sm"
                      >
                        View All Categories →
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
        \{/* Bottom Footer */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 MRBIKEMODZ. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
