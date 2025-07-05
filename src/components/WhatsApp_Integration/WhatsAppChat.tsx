"use client";
import React from "react";
import { useSelector } from "react-redux";
import { selectIsCustomerExperienceEnabled } from "@/components/store/storeSettingsSlice";

interface WhatsAppChatProps {
  phoneNumber: string;
  message?: string;
}

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({
  phoneNumber,
  message = "Hi! I'm interested in your auto parts. Can you help me?",
}) => {
  const isWhatsAppEnabled = useSelector(
    selectIsCustomerExperienceEnabled("enableWhatsAppChat")
  );

  // Don't render if WhatsApp chat is disabled
  if (!isWhatsAppEnabled) {
    return null;
  }

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "");

    // If it starts with 0, remove it (common in some countries)
    if (cleaned.startsWith("0")) {
      return cleaned.substring(1);
    }

    // If it's a 10-digit number, assume it's Indian and add +91
    if (cleaned.length === 10) {
      return `91${cleaned}`;
    }

    // If it's already 12 digits and starts with 91, it's Indian
    if (cleaned.length === 12 && cleaned.startsWith("91")) {
      return cleaned;
    }

    // If it's 11 digits and starts with 91, it's Indian
    if (cleaned.length === 11 && cleaned.startsWith("91")) {
      return cleaned;
    }

    // If it's 13 digits and starts with 91, it's Indian
    if (cleaned.length === 13 && cleaned.startsWith("91")) {
      return cleaned;
    }

    // For other cases, return as is (user should provide country code)
    return cleaned;
  };

  const handleWhatsAppClick = () => {
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

      // Try to open WhatsApp Web or app
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      // Fallback for mobile devices
      if (
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        // For mobile, try to open the WhatsApp app directly
        const mobileUrl = `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`;
        window.location.href = mobileUrl;
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      // Fallback: just open WhatsApp Web
      window.open("https://web.whatsapp.com", "_blank");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleWhatsAppClick();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        onKeyPress={handleKeyPress}
        className="relative bg-green-500 hover:bg-green-600 text-white w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 group border border-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        {/* Icon */}
        <svg
          className="w-7 h-7"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>

        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
          Chat with us on WhatsApp
        </div>
        {/* Tooltip arrow */}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};

export default WhatsAppChat;
