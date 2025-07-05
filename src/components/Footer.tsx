"use client";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  selectUniqueCategories,
  selectLoading,
} from "@/components/store/productSlice";
import { useRouter } from "next/navigation";
import { useTheme } from "./hooks/useTheme";

const Footer = () => {
  const router = useRouter();
  const uniqueCategories = useSelector(selectUniqueCategories);
  const loading = useSelector(selectLoading);
  const { getFooterClasses, getClass, getClasses } = useTheme();

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
          ? ["Loading...", "Loading...", "Loading..."]
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
      links: ["Installation Guide", "Warranty", "Returns", "FAQ"],
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

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://www.facebook.com/share/1HUtQoEnwq/",
      color: "hover:text-blue-400",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/mrbikemodz?igsh=d250Ym1tb3NtcDZw",
      color: "hover:text-pink-400",
    },
    { icon: Youtube, href: "#", color: "hover:text-red-400" },
  ];

  return (
    <footer id="footer" className={getFooterClasses()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <div
                  className={`text-2xl font-bold ${getClass(
                    "textPrimary"
                  )} mb-2`}
                >
                  MR<span className={getClass("accentPrimary")}>BIKEMODZ</span>
                </div>
                <p className={getClass("textSecondary")}>
                  Your trusted partner for premium auto spare parts and
                  accessories. Quality, performance, and reliability guaranteed.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div
                  className={`flex items-center ${getClass("textSecondary")}`}
                >
                  <Phone
                    className={`h-5 w-5 mr-3 ${getClass("accentPrimary")}`}
                  />
                  <span>+91 6304187805</span>
                </div>
                <div
                  className={`flex items-center ${getClass("textSecondary")}`}
                >
                  <Mail
                    className={`h-5 w-5 mr-3 ${getClass("accentPrimary")}`}
                  />
                  <span>mrbikemodz@gmail.com</span>
                </div>
                <div
                  className={`flex items-center ${getClass("textSecondary")}`}
                >
                  <MapPin
                    className={`h-5 w-5 mr-3 ${getClass("accentPrimary")}`}
                  />
                  <span>
                    Anitha, Uma, Maheswari tample, VRC Centre, Nellore, Andhra
                    Pradesh 524001
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${getClass("textSecondary")} ${
                        social.color
                      } transition-colors duration-200`}
                      aria-label={`Follow us on ${social.icon.name}`}
                    >
                      <Icon className="h-6 w-6" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3
                  className={`${getClass(
                    "textPrimary"
                  )} font-semibold text-lg mb-4`}
                >
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
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
                        className={`${getClass("textSecondary")} ${getClass(
                          "accentPrimary"
                        ).replace(
                          "text-",
                          "hover:text-"
                        )} transition-colors duration-200 cursor-pointer`}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                  {section.title === "Products" && hasMoreCategories && (
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push("/product/allproducts");
                        }}
                        className={`${getClass("textSecondary")} ${getClass(
                          "accentPrimary"
                        ).replace(
                          "text-",
                          "hover:text-"
                        )} transition-colors duration-200 cursor-pointer text-sm`}
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
        {/* Bottom Footer */}
        <div className={`py-6 ${getClass("divider")}`}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div
              className={`${getClass("textSecondary")} text-sm mb-4 md:mb-0`}
            >
              © 2024 MRBIKEMODZ. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className={`${getClass("textSecondary")} ${getClass(
                  "accentPrimary"
                ).replace("text-", "hover:text-")} transition-colors`}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className={`${getClass("textSecondary")} ${getClass(
                  "accentPrimary"
                ).replace("text-", "hover:text-")} transition-colors`}
              >
                Terms of Service
              </a>
              <a
                href="#"
                className={`${getClass("textSecondary")} ${getClass(
                  "accentPrimary"
                ).replace("text-", "hover:text-")} transition-colors`}
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
