import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "Products",
      links: [
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

  const socialLinks = [
    { icon: Facebook, href: "#", color: "hover:text-blue-400" },
    { icon: Twitter, href: "#", color: "hover:text-sky-400" },
    { icon: Instagram, href: "#", color: "hover:text-pink-400" },
    { icon: Youtube, href: "#", color: "hover:text-red-400" },
  ];

  return (
    <footer className="bg-black border-t border-gray-800">
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
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Mail className="h-5 w-5 mr-3 text-red-400" />
                  <span>info@mrbikemodz.com</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="h-5 w-5 mr-3 text-red-400" />
                  <span>123 Auto Street, Car City, CC 12345</span>
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
                      className={`text-gray-400 ${social.color} transition-colors duration-200`}
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
                <h3 className="text-white font-semibold text-lg mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-white font-semibold text-lg mb-2">
                Stay Updated
              </h3>
              <p className="text-gray-400">
                Get the latest products and exclusive offers delivered to your
                inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-col lg:flex-row w-full sm:w-auto sm:flex-wrap sm:gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-t-md lg:rounded-l-md lg:rounded-tr-none flex-1 lg:w-64 focus:outline-none focus:border-red-500"
              />
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-b-md lg:rounded-r-md lg:rounded-bl-none transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 MRBIKEMODZ. All rights reserved.
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
