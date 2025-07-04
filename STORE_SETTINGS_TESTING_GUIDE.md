# Store Settings Testing Guide

## 🎯 Overview

This guide helps you test the store settings toggle functionality to ensure that:

1. **Enabled/Disabled messages** show correctly
2. **Icons change** appropriately for enabled vs disabled states
3. **Real-time synchronization** works across instances
4. **Toast notifications** display the correct state

## 🚀 Quick Test Setup

### 1. Start the Full System

```bash
npm run dev:full
```

### 2. Test Toggle Logic

```bash
npm run test-toggle
```

You should see:

```
🧪 Testing Store Settings Toggle Functionality
1. Feature (enabled -> disabled):
   ✅ Expected: disabled
2. Feature (disabled -> enabled):
   ✅ Expected: enabled
```

## 🧪 Manual Testing Steps

### Test 1: Feature Toggles

1. **Navigate to retailer dashboard**: `/retailer-dashboard`
2. **Go to Features tab**
3. **Test each feature toggle**:
   - Click on any feature (e.g., "Add to Cart")
   - Check console for toggle logs
   - Verify toast message shows correct state
   - Verify icon changes appropriately

### Test 2: Page Access Toggles

1. **Go to Page Access tab**
2. **Test each page toggle**:
   - Click on any page (e.g., "Cart")
   - Check console for toggle logs
   - Verify toast message shows correct state
   - Verify icon changes appropriately

### Test 3: Customer Experience Toggles

1. **Go to Customer Experience tab**
2. **Test each setting toggle**:
   - Click on any setting (e.g., "Show Prices")
   - Check console for toggle logs
   - Verify toast message shows correct state
   - Verify icon changes appropriately

## 📊 Expected Behavior

### ✅ Successful Toggle Functionality

When toggling works properly, you should see:

1. **Console logs:**

   ```
   Feature wishlist: true -> false
   Page cart: false -> true
   Customer Experience showPrices: true -> false
   ```

2. **Toast notifications:**

   - "wishlist enabled" (when enabling)
   - "wishlist disabled" (when disabling)
   - "cart page enabled" (when enabling page)
   - "cart page disabled" (when disabling page)

3. **Icon changes:**

   - **Enabled state**: Green icons (e.g., Heart, ShoppingCart, Star)
   - **Disabled state**: Gray icons (e.g., HeartOff, MinusCircle, StarOff)

4. **Visual indicators:**
   - **Enabled**: Green border-left, green background for icon
   - **Disabled**: Gray border-left, gray background for icon

### ❌ Issues to Watch For

1. **Always shows "disabled":**

   - Check if Redux state is updating correctly
   - Verify the toggle logic is working
   - Check console for toggle logs

2. **Icons not changing:**

   - Verify icon mapping is correct
   - Check if enabled state is being passed correctly
   - Ensure icons are imported properly

3. **No real-time updates:**
   - Check if WebSocket server is running
   - Verify broadcast function is available
   - Check console for broadcast logs

## 🔍 Debugging Steps

### 1. Check Console Logs

Open browser console and look for:

```
Feature wishlist: true -> false
Page cart: false -> true
Customer Experience showPrices: true -> false
```

### 2. Check Toast Messages

Verify toast notifications show:

- "enabled" when turning something on
- "disabled" when turning something off

### 3. Check Icon Changes

Verify icons change appropriately:

**Features:**

- `addToCart`: ShoppingCart ↔ MinusCircle
- `wishlist`: Heart ↔ HeartOff
- `reviews`: Star ↔ StarOff
- `search`: Search ↔ X
- `filters`: Filter ↔ Slash
- `categories`: Grid ↔ Square
- `productImages`: Image ↔ ImageOff
- `productDetails`: FileText ↔ FileX
- `priceDisplay`: DollarSign ↔ X
- `stockDisplay`: Package ↔ X
- `discountDisplay`: Tag ↔ X
- `relatedProducts`: Grid ↔ Square
- `shareProducts`: Share ↔ Share2

**Pages:**

- `home`: Home ↔ X
- `allProducts`: ShoppingCart ↔ X
- `individualProduct`: FileText ↔ FileX
- `category`: Grid ↔ Square
- `wishlist`: Heart ↔ HeartOff
- `cart`: ShoppingCart ↔ MinusCircle
- `customerDashboard`: User ↔ X
- `auth`: Lock ↔ X

**Customer Experience:**

- `allowGuestBrowsing`: Eye ↔ EyeOff
- `requireLoginForPurchase`: Lock ↔ X
- `requireLoginForWishlist`: Lock ↔ X
- `showPrices`: DollarSign ↔ X
- `showStock`: Package ↔ X
- `allowProductSharing`: Share ↔ Share2
- `enableNotifications`: Bell ↔ BellOff

## 🛠️ Testing Specific Scenarios

### Test Enabled -> Disabled

1. **Find an enabled feature** (green border, green icon)
2. **Click the toggle button**
3. **Expected results:**
   - Console: `Feature [name]: true -> false`
   - Toast: `"[name] disabled"`
   - Icon: Changes to disabled version
   - Border: Changes to gray
   - Background: Changes to gray

### Test Disabled -> Enabled

1. **Find a disabled feature** (gray border, gray icon)
2. **Click the toggle button**
3. **Expected results:**
   - Console: `Feature [name]: false -> true`
   - Toast: `"[name] enabled"`
   - Icon: Changes to enabled version
   - Border: Changes to green
   - Background: Changes to green

### Test Real-Time Sync

1. **Open multiple browser tabs**
2. **Navigate to retailer dashboard in one tab**
3. **Navigate to customer pages in other tabs**
4. **Toggle a setting in retailer tab**
5. **Expected results:**
   - Console: "Broadcasting store settings update to other instances"
   - Other tabs: Receive toast notification
   - Customer pages: Update immediately

## 📈 Performance Testing

### Test Multiple Toggles

1. **Toggle 5+ settings rapidly**
2. **Monitor console for logs**
3. **Check for any errors**
4. **Verify all toggles work correctly**

### Test Large Settings Changes

1. **Reset all settings to defaults**
2. **Toggle multiple settings at once**
3. **Monitor performance**
4. **Check memory usage**

### Test Network Issues

1. **Disconnect network temporarily**
2. **Try to toggle settings**
3. **Reconnect network**
4. **Verify fallback works**

## 🎯 Success Criteria

### ✅ Toggle Functionality Working

- [ ] Console logs show correct state changes
- [ ] Toast messages show "enabled" or "disabled" correctly
- [ ] Icons change appropriately for enabled/disabled states
- [ ] Visual indicators (borders, backgrounds) change correctly
- [ ] No errors in console

### ✅ Real-Time Sync Working

- [ ] Changes broadcast to other instances
- [ ] Toast notifications appear in other instances
- [ ] UI updates immediately without page refresh
- [ ] WebSocket connection is stable

### ✅ Icon System Working

- [ ] Enabled features show appropriate icons
- [ ] Disabled features show appropriate icons
- [ ] Icons change when toggling
- [ ] No missing or broken icons

## 🚨 Troubleshooting

### Issue: Always Shows "Disabled"

**Symptoms:**

- Toast always shows "disabled"
- Console logs show incorrect state changes

**Solutions:**

1. **Check Redux state:**

   ```javascript
   // In browser console
   console.log(store.getState().storeSettings);
   ```

2. **Check toggle logic:**

   - Verify `newState = !currentState` logic
   - Check if `currentState` is being read correctly

3. **Check API responses:**
   - Look for 500 errors in Network tab
   - Verify database updates are working

### Issue: Icons Not Changing

**Symptoms:**

- Icons remain the same when toggling
- Missing icons or broken images

**Solutions:**

1. **Check icon imports:**

   - Verify all icons are imported from lucide-react
   - Check for any missing icon imports

2. **Check icon mapping:**

   - Verify `getFeatureIcon`, `getPageIcon`, `getCustomerExperienceIcon` functions
   - Check if enabled/disabled state is passed correctly

3. **Check component re-rendering:**
   - Verify components re-render when state changes
   - Check if Redux state updates are triggering re-renders

### Issue: No Real-Time Updates

**Symptoms:**

- Changes only appear after page refresh
- No toast notifications from other instances

**Solutions:**

1. **Start WebSocket server:**

   ```bash
   npm run websocket
   ```

2. **Check broadcast function:**

   ```javascript
   // In browser console
   typeof window.broadcastDataUpdate;
   ```

3. **Check console for errors:**
   - Look for WebSocket connection errors
   - Check for API errors

## 📞 Support

If you encounter issues:

1. **Check the troubleshooting guide** above
2. **Run the test scripts:**
   ```bash
   npm run test-toggle
   npm run test-store-settings
   ```
3. **Check browser console** for specific error messages
4. **Verify WebSocket server** is running
5. **Test with multiple browsers** to isolate issues

## 🎉 Success!

When everything is working correctly, you'll have:

- **Correct enabled/disabled messages** in toast notifications
- **Appropriate icon changes** for enabled vs disabled states
- **Real-time synchronization** across all app instances
- **Clear visual feedback** for all state changes
- **Robust error handling** and fallback mechanisms
- **Comprehensive logging** for debugging

## 📋 Testing Checklist

### Setup

- [ ] WebSocket server running (`npm run websocket`)
- [ ] Next.js app running (`npm run dev`)
- [ ] Browser console open for debugging
- [ ] Multiple browser tabs open

### Toggle Testing

- [ ] Test feature toggles (enabled -> disabled)
- [ ] Test feature toggles (disabled -> enabled)
- [ ] Test page access toggles
- [ ] Test customer experience toggles
- [ ] Verify console logs show correct state changes
- [ ] Verify toast messages show correct state

### Icon Testing

- [ ] Verify enabled icons are green and appropriate
- [ ] Verify disabled icons are gray and appropriate
- [ ] Verify icons change when toggling
- [ ] Check all icon types (features, pages, customer experience)

### Real-Time Testing

- [ ] Changes broadcast to other instances
- [ ] Toast notifications appear in other instances
- [ ] UI updates immediately without page refresh
- [ ] No errors in console
