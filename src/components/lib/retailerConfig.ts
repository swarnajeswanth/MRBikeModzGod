// Configuration for retailer access control

// Whitelisted emails that can register as retailers
export const WHITELISTED_RETAILER_EMAILS = [
  "mrbikemodz@gmail.com",
  "swarnajeswanth1234@gmail.com",
];

// Check if an email is whitelisted for retailer registration
export const isWhitelistedRetailerEmail = (email: string): boolean => {
  return WHITELISTED_RETAILER_EMAILS.includes(email.toLowerCase());
};

// Get all whitelisted retailer emails
export const getWhitelistedEmails = (): string[] => {
  return [...WHITELISTED_RETAILER_EMAILS];
};
