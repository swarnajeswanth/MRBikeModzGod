"use client";

import { Toaster as OriginalToaster, toast } from "react-hot-toast";
import { useEffect } from "react";

const CustomToaster = () => {
  useEffect(() => {
    // Function to handle toast clicks
    const handleToastClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Look for toast elements by various selectors
      const toastElement =
        target.closest('[data-testid="toast"]') ||
        target.closest('[role="alert"]') ||
        target.closest('[class*="toast"]') ||
        target.closest('[class*="notification"]');

      if (toastElement) {
        // Prevent event bubbling
        event.preventDefault();
        event.stopPropagation();

        // Try to find the toast ID
        const toastId =
          toastElement.getAttribute("data-toast-id") ||
          toastElement.getAttribute("id");

        if (toastId) {
          toast.dismiss(toastId);
        } else {
          // Fallback: dismiss all toasts
          toast.dismiss();
        }
      }
    };

    // Add click listener with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleToastClick, true);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleToastClick, true);
    };
  }, []);

  return (
    <OriginalToaster
      toastOptions={{
        style: {
          background: "#1f1f1f",
          color: "#fff",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        },
        success: {
          style: {
            border: "1px solid green",
            background: "#1f1f1f",
            color: "#fff",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          },
        },
        error: {
          style: {
            border: "1px solid red",
            background: "#1f1f1f",
            color: "#fff",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          },
        },
        loading: {
          style: {
            border: "1px solid #fbbf24",
            background: "#1f1f1f",
            color: "#fff",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          },
        },
      }}
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        top: 20,
        right: 20,
      }}
    />
  );
};

export default CustomToaster;
