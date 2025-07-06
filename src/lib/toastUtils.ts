import { toast as originalToast, Toast } from "react-hot-toast";

// Custom toast function that makes toasts clickable
export const toast = {
  success: (message: string, options?: any) => {
    return originalToast.success(message, {
      ...options,
      style: {
        ...options?.style,
        cursor: "pointer",
      },
      onClick: () => {
        // Close the toast when clicked
        originalToast.dismiss();
      },
    });
  },

  error: (message: string, options?: any) => {
    return originalToast.error(message, {
      ...options,
      style: {
        ...options?.style,
        cursor: "pointer",
      },
      onClick: () => {
        // Close the toast when clicked
        originalToast.dismiss();
      },
    });
  },

  loading: (message: string, options?: any) => {
    return originalToast.loading(message, {
      ...options,
      style: {
        ...options?.style,
        cursor: "pointer",
      },
      onClick: () => {
        // Close the toast when clicked
        originalToast.dismiss();
      },
    });
  },

  // Generic toast function
  custom: (message: string, options?: any) => {
    return originalToast(message, {
      ...options,
      style: {
        ...options?.style,
        cursor: "pointer",
      },
      onClick: () => {
        // Close the toast when clicked
        originalToast.dismiss();
      },
    });
  },

  // Dismiss function
  dismiss: originalToast.dismiss,

  // Promise wrapper
  promise: originalToast.promise,
};

export default toast;
