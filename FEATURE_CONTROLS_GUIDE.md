# Feature Controls Implementation Guide

## Overview

The Store Settings system provides comprehensive control over which features are available to customers. When features are disabled, they are completely hidden from the customer interface, providing a clean and controlled user experience.

## ✅ **Fixed Issues**

### 1. **Icons Now Change Dynamically**

- **Enabled Features**: Show full, colorful icons (e.g., `ShoppingCart`, `Heart`, `Star`)
- **Disabled Features**: Show muted or crossed-out icons (e.g., `MinusCircle`, `HeartOff`, `StarOff`, `X`)
- **Real-time Updates**: Icons change immediately when toggling features

### 2. **Text Updates in Real-time**

- **Status Text**: "Enabled" ↔ "Disabled" updates immediately
- **Toast Messages**: Show correct state (using current state before toggle)
- **Visual Indicators**: CheckCircle/XCircle icons with colored text

### 3. **Features Are Properly Hidden from Customers**

- **Complete Hiding**: Disabled features don't appear in customer interface
- **Fallback UI**: Appropriate disabled state messages
- **Access Control**: Page-level restrictions when needed

## 🎯 **Feature Categories**

### **1. FEATURES TAB** - Controls specific functionality

| Feature           | Description               | Customer Impact                              |
| ----------------- | ------------------------- | -------------------------------------------- |
| `addToCart`       | Add to cart functionality | Hides "Add to Cart" buttons throughout store |
| `wishlist`        | Wishlist functionality    | Hides wishlist buttons and functionality     |
| `reviews`         | Product reviews           | Hides review forms and review display        |
| `ratings`         | Star ratings              | Hides star ratings on products               |
| `search`          | Search functionality      | Hides search bars and search results         |
| `filters`         | Product filtering         | Hides filter options and controls            |
| `categories`      | Category navigation       | Hides category browsing and navigation       |
| `productImages`   | Product images            | Hides images, shows placeholder              |
| `productDetails`  | Detailed product info     | Hides detailed product information           |
| `priceDisplay`    | Price information         | Hides all price information                  |
| `stockDisplay`    | Stock availability        | Hides stock information                      |
| `discountDisplay` | Discounts and promotions  | Hides discount badges                        |
| `relatedProducts` | Related products          | Hides "related products" sections            |
| `shareProducts`   | Social media sharing      | Hides sharing buttons                        |

### **2. PAGES TAB** - Controls page access

| Page                | Description           | Customer Impact                      |
| ------------------- | --------------------- | ------------------------------------ |
| `home`              | Homepage access       | Restricts access to homepage         |
| `allProducts`       | Product listing pages | Restricts access to product listings |
| `individualProduct` | Product detail pages  | Restricts access to product details  |
| `category`          | Category pages        | Restricts access to category pages   |
| `wishlist`          | Wishlist page         | Restricts access to wishlist         |
| `cart`              | Shopping cart         | Restricts access to cart             |
| `customerDashboard` | Customer dashboard    | Restricts access to dashboard        |
| `auth`              | Login/registration    | Restricts access to auth pages       |

### **3. CUSTOMER EXPERIENCE TAB** - Controls user experience

| Setting                   | Description            | Customer Impact                 |
| ------------------------- | ---------------------- | ------------------------------- |
| `allowGuestBrowsing`      | Guest browsing         | Requires login for all browsing |
| `requireLoginForPurchase` | Purchase requirements  | Requires login before purchase  |
| `requireLoginForWishlist` | Wishlist requirements  | Requires login to use wishlist  |
| `showPrices`              | Price visibility       | Hides prices from all customers |
| `showStock`               | Stock visibility       | Hides stock information         |
| `allowProductSharing`     | Social sharing         | Disables social media sharing   |
| `enableNotifications`     | Customer notifications | Disables customer notifications |

## 🛠️ **Implementation Methods**

### **Method 1: Using StoreSettingsWrapper (Recommended for simple cases)**

```tsx
import StoreSettingsWrapper from "@/components/StoreSettingsWrapper";

// Simple show/hide with fallback
<StoreSettingsWrapper
  feature="wishlist"
  fallback={
    <button disabled className="bg-gray-400 text-gray-600 px-4 py-2 rounded-lg">
      Wishlist (Disabled)
    </button>
  }
>
  <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
    Add to Wishlist
  </button>
</StoreSettingsWrapper>;
```

### **Method 2: Using selectIsFeatureEnabled (For complex logic)**

```tsx
import { useSelector } from "react-redux";
import { selectIsFeatureEnabled } from "@/components/store/storeSettingsSlice";

const ProductCard = ({ product }) => {
  const isAddToCartEnabled = useSelector(selectIsFeatureEnabled("addToCart"));
  const isWishlistEnabled = useSelector(selectIsFeatureEnabled("wishlist"));
  const isPriceDisplayEnabled = useSelector(
    selectIsFeatureEnabled("priceDisplay")
  );

  return (
    <div className="product-card">
      {/* Price - Hidden if disabled */}
      {isPriceDisplayEnabled && <div className="price">${product.price}</div>}

      {/* Action Buttons */}
      <div className="actions">
        {isAddToCartEnabled ? (
          <button className="add-to-cart">Add to Cart</button>
        ) : (
          <button disabled className="disabled">
            Add to Cart (Disabled)
          </button>
        )}

        {isWishlistEnabled && (
          <button className="wishlist">Add to Wishlist</button>
        )}
      </div>
    </div>
  );
};
```

### **Method 3: Page Access Control**

```tsx
import { useSelector } from "react-redux";
import { RootState } from "@/components/store";

const ProtectedPage = () => {
  const isPageAccessible = useSelector(
    (state: RootState) => state.storeSettings?.pages?.wishlist ?? true
  );

  if (!isPageAccessible) {
    return (
      <div className="access-restricted">
        <Lock className="h-16 w-16 text-gray-400" />
        <h1>Access Restricted</h1>
        <p>This page is currently not accessible.</p>
      </div>
    );
  }

  return <WishlistContent />;
};
```

## 🎨 **Visual Feedback System**

### **Dynamic Icons**

- **Enabled**: Full, colorful icons (e.g., `ShoppingCart`, `Heart`, `Star`)
- **Disabled**: Muted or crossed-out icons (e.g., `MinusCircle`, `HeartOff`, `StarOff`, `X`)

### **Color Coding**

- **Features Tab**: Green theme for enabled, gray for disabled
- **Pages Tab**: Blue theme for accessible, gray for restricted
- **Customer Experience Tab**: Yellow theme for enabled, gray for disabled

### **Status Indicators**

- **CheckCircle**: Green for enabled features
- **XCircle**: Gray for disabled features
- **Real-time Text**: "Enabled" ↔ "Disabled" updates immediately

### **Smooth Transitions**

- **Hover Effects**: Cards highlight on hover
- **State Changes**: Smooth transitions when toggling
- **Loading States**: Visual feedback during operations

## 📋 **Best Practices**

### **1. Always Provide Fallback UI**

```tsx
// Good: Provides disabled state
{
  isFeatureEnabled ? (
    <button className="enabled">Feature</button>
  ) : (
    <button disabled className="disabled">
      Feature (Disabled)
    </button>
  );
}

// Bad: Just hides without feedback
{
  isFeatureEnabled && <button>Feature</button>;
}
```

### **2. Use Appropriate Icons**

```tsx
// Good: Clear visual indication
{
  isEnabled ? <ShoppingCart /> : <MinusCircle />;
}

// Bad: Same icon for both states
<ShoppingCart />;
```

### **3. Provide Clear Messaging**

```tsx
// Good: Clear disabled message
<button disabled title="Feature is currently disabled">
  Feature (Disabled)
</button>

// Bad: No explanation
<button disabled>Feature</button>
```

### **4. Test Feature Combinations**

- Test all possible feature combinations
- Ensure disabled features don't break the UI
- Verify fallback states work correctly

## 🔧 **Technical Implementation**

### **Redux State Structure**

```typescript
interface StoreSettings {
  features: {
    addToCart: boolean;
    wishlist: boolean;
    reviews: boolean;
    // ... all features
  };
  pages: {
    home: boolean;
    allProducts: boolean;
    // ... all pages
  };
  customerExperience: {
    allowGuestBrowsing: boolean;
    // ... all settings
  };
}
```

### **Selectors**

```typescript
// Feature-specific selector
export const selectIsFeatureEnabled =
  (feature: keyof StoreSettings["features"]) =>
  (state: { storeSettings: StoreSettings }) =>
    state.storeSettings?.features?.[feature] ?? true;

// Page-specific selector
export const selectIsPageAccessible =
  (page: keyof StoreSettings["pages"]) =>
  (state: { storeSettings: StoreSettings }) =>
    state.storeSettings?.pages?.[page] ?? true;
```

### **Actions**

```typescript
// Toggle individual features
dispatch(toggleFeature("wishlist"));

// Toggle page access
dispatch(togglePageAccess("home"));

// Toggle customer experience settings
dispatch(toggleCustomerExperience("showPrices"));
```

## 🚀 **Getting Started**

1. **Access Store Settings**: Navigate to the retailer dashboard
2. **Configure Features**: Toggle features on/off as needed
3. **Test Customer Experience**: View the store as a customer
4. **Implement in Components**: Use the provided methods to hide features
5. **Monitor Usage**: Check how feature changes affect user behavior

## 📝 **Example Implementation**

See `src/components/FeatureImplementationExample.tsx` for comprehensive examples of how to implement feature hiding throughout your application.

## 🎯 **Key Benefits**

- **Complete Control**: Hide any feature from customers
- **Real-time Updates**: Changes take effect immediately
- **Visual Feedback**: Clear indication of feature states
- **Flexible Implementation**: Multiple ways to implement hiding
- **User-Friendly**: Appropriate fallback UI for disabled features
- **Scalable**: Easy to add new features and controls

This system provides store administrators with complete control over the customer experience while maintaining a clean and professional interface.
