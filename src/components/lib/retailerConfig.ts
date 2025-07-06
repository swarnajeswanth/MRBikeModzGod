// Configuration for retailer access control

// Whitelisted emails that can register as retailers
export const WHITELISTED_RETAILER_EMAILS = [
  "mrbikemodz@gmail.com",
  "swarnajeswanth1234@gmail.com",
];

// Check if an email is whitelisted for retailer registration
export const isWhitelistedRetailerEmail = (email: string): boolean => {
  if (!email) return false;
  return WHITELISTED_RETAILER_EMAILS.includes(email.toLowerCase().trim());
};

// Get all whitelisted retailer emails
export const getWhitelistedEmails = (): string[] => {
  return [...WHITELISTED_RETAILER_EMAILS];
};

// Validate email format
export const isValidEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Comprehensive retailer email validation
export const validateRetailerEmail = (
  email: string
): {
  isValid: boolean;
  message: string;
} => {
  if (!email) {
    return {
      isValid: false,
      message: "Email is required for retailer registration.",
    };
  }

  if (!isValidEmailFormat(email)) {
    return {
      isValid: false,
      message: "Please enter a valid email address.",
    };
  }

  if (!isWhitelistedRetailerEmail(email)) {
    return {
      isValid: false,
      message:
        "This email is not authorized for retailer registration. Please contact support for access.",
    };
  }

  return {
    isValid: true,
    message: "Email is valid for retailer registration.",
  };
};
