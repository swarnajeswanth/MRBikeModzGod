# Store Settings Real-Time Synchronization Guide

## 🎯 Overview

This guide helps you test the real-time synchronization of store settings to ensure that when a retailer changes store settings, the changes are immediately reflected across all customer instances (different browsers, tabs, or devices).

## 🚀 Quick Test Setup

### 1. Start the Full System

```bash
npm run dev:full
```

This starts both:

- Next.js app on http://localhost:3000
- WebSocket server on ws://localhost:3001

### 2. Test Store Settings Sync

```bash
npm run test-store-settings
```

You should see:

```
🧪 Testing Store Settings Real-Time Sync
✅ Retailer Instance 1 connected
✅ Customer Instance 2 connected
✅ Customer Instance 3 connected
📤 Retailer Instance 1 broadcasting STORE_SETTINGS_UPDATED...
📨 Customer Instance 2 received: STORE_SETTINGS_UPDATED from retailer-instance-1
📨 Customer Instance 3 received: STORE_SETTINGS_UPDATED from retailer-instance-1
✅ Store settings sync test completed!
```

## 🧪 Manual Testing Steps

### Test 1: Multiple Browser Tabs

1. **Open multiple tabs** to http://localhost:3000
2. **Navigate to retailer dashboard** in one tab: `/retailer-dashboard`
3. **Navigate to customer pages** in other tabs (homepage, product pages, etc.)
4. **Change store settings** in the retailer tab
5. **Watch for real-time updates** in customer tabs

### Test 2: Different Browsers

1. **Open Chrome** and navigate to `/retailer-dashboard`
2. **Open Firefox** and navigate to the homepage or product pages
3. **Change store settings** in Chrome (retailer)
4. **Watch for updates** in Firefox (customer)

### Test 3: Feature Toggle Testing

1. **Disable a feature** (e.g., "wishlist") in retailer dashboard
2. **Check customer pages** - wishlist buttons should disappear immediately
3. **Enable the feature** again
4. **Check customer pages** - wishlist buttons should reappear immediately

## 📊 Expected Behavior

### ✅ Successful Real-Time Sync

When store settings changes work properly, you should see:

1. **In the retailer instance:**

   - Toast notification: "Feature disabled/enabled"
   - Console log: "Broadcasting store settings update to other instances"
   - Console log: "Broadcasting update: STORE_SETTINGS_UPDATED"

2. **In customer instances:**

   - Toast notification: "Store settings updated from another instance"
   - UI updates immediately without page refresh
   - Features appear/disappear based on new settings

3. **In WebSocket server console:**
   - "Received message: { type: 'STORE_SETTINGS_UPDATED', ... }"
   - "Broadcasted to X other clients"

### ❌ Issues to Watch For

1. **No real-time updates:**

   - Check if WebSocket server is running
   - Look for "WebSocket not connected" in console
   - Verify connection status

2. **Settings not saving:**

   - Check browser console for API errors
   - Verify database connection
   - Check for network errors

3. **UI not updating:**
   - Check if StoreSettingsWrapper is properly implemented
   - Verify Redux selectors are working
   - Check for component re-rendering issues

## 🔍 Debugging Steps

### 1. Check WebSocket Connection

Open browser console and look for:

```
Real-time sync connected
```

If you see:

```
WebSocket connection failed, will attempt fallback
Max WebSocket connection attempts reached, using polling fallback
```

Then the WebSocket server isn't running.

### 2. Check Store Settings API

Test the store settings API:

```bash
curl -X GET http://localhost:3000/api/store-settings
```

Should return current store settings.

### 3. Check Broadcast Function

In browser console, type:

```javascript
typeof window.broadcastDataUpdate;
```

Should return: `"function"`

### 4. Test Store Settings Update

In browser console:

```javascript
// Test broadcast function
window.broadcastDataUpdate("STORE_SETTINGS_UPDATED");
```

Should log: "Broadcasting update: STORE_SETTINGS_UPDATED"

## 🛠️ Testing Specific Features

### Test Feature Controls

1. **Disable "Add to Cart":**

   - Go to retailer dashboard → Features tab
   - Toggle "Add to Cart" to disabled
   - Check product pages - "Add to Cart" buttons should disappear

2. **Disable "Wishlist":**

   - Toggle "Wishlist" to disabled
   - Check product pages - wishlist buttons should disappear

3. **Disable "Reviews":**

   - Toggle "Reviews" to disabled
   - Check product pages - review sections should disappear

4. **Disable "Price Display":**
   - Toggle "Price Display" to disabled
   - Check product pages - prices should be hidden

### Test Page Access Controls

1. **Disable "Cart" page:**

   - Go to retailer dashboard → Page Access tab
   - Toggle "Cart" to disabled
   - Try to access `/cart` - should be restricted

2. **Disable "Wishlist" page:**
   - Toggle "Wishlist" to disabled
   - Try to access wishlist - should be restricted

### Test Customer Experience

1. **Disable "Show Prices":**

   - Go to retailer dashboard → Customer Experience tab
   - Toggle "Show Prices" to disabled
   - Check all pages - prices should be hidden

2. **Disable "Show Stock":**
   - Toggle "Show Stock" to disabled
   - Check product pages - stock information should be hidden

## 📈 Performance Testing

### Test Multiple Instances

1. **Open 5+ browser tabs** to different pages
2. **Change store settings** in retailer dashboard
3. **Monitor timing** - updates should appear within 1-2 seconds
4. **Check all instances** receive updates

### Test Large Settings Changes

1. **Reset all settings** to defaults
2. **Monitor performance** across instances
3. **Check memory usage** in browser dev tools
4. **Verify all instances** receive updates

### Test Network Issues

1. **Disconnect network** temporarily
2. **Change settings** (should fail gracefully)
3. **Reconnect network**
4. **Verify fallback polling** works

## 🎯 Success Criteria

### ✅ Real-Time Sync Working

- [ ] WebSocket server running on port 3001
- [ ] Browser console shows "Real-time sync connected"
- [ ] Store settings changes broadcast to all instances
- [ ] Customer instances receive updates within 2 seconds
- [ ] Toast notifications appear in all instances
- [ ] UI updates immediately without page refresh

### ✅ Feature Controls Working

- [ ] Disabled features are hidden from customer UI
- [ ] Enabled features are visible in customer UI
- [ ] Changes apply immediately across all instances
- [ ] No page refresh required for updates

### ✅ Page Access Working

- [ ] Disabled pages are restricted for customers
- [ ] Enabled pages are accessible for customers
- [ ] Access changes apply immediately
- [ ] Proper error messages for restricted pages

### ✅ Customer Experience Working

- [ ] Price visibility controls work correctly
- [ ] Stock visibility controls work correctly
- [ ] Guest browsing controls work correctly
- [ ] Login requirements work correctly

## 🚨 Troubleshooting

### Issue: Store Settings Not Syncing

**Symptoms:**

- Changes only appear after page refresh
- No toast notifications from other instances
- Console shows "WebSocket not connected"

**Solutions:**

1. **Start WebSocket server:**

   ```bash
   npm run websocket
   ```

2. **Check API endpoints:**

   ```bash
   curl -X GET http://localhost:3000/api/store-settings
   ```

3. **Restart everything:**
   ```bash
   npm run dev:full
   ```

### Issue: Features Not Updating

**Symptoms:**

- Store settings change but UI doesn't update
- Features remain visible when disabled

**Solutions:**

1. **Check StoreSettingsWrapper implementation:**

   ```tsx
   <StoreSettingsWrapper feature="wishlist">
     <WishlistButton />
   </StoreSettingsWrapper>
   ```

2. **Check Redux selectors:**

   ```tsx
   const isWishlistEnabled = useSelector(selectIsFeatureEnabled("wishlist"));
   ```

3. **Verify component re-rendering:**
   - Check if components are properly subscribed to Redux state
   - Ensure StoreSettingsWrapper is used correctly

### Issue: Settings Not Saving

**Symptoms:**

- Changes revert after page refresh
- Console shows API errors

**Solutions:**

1. **Check database connection:**

   - Verify MongoDB is running
   - Check connection string

2. **Check API responses:**

   - Look for 500 errors in Network tab
   - Check server logs for errors

3. **Test API manually:**
   ```bash
   curl -X PUT http://localhost:3000/api/store-settings \
     -H "Content-Type: application/json" \
     -d '{"features":{"wishlist":false}}'
   ```

## 🚀 Production Considerations

For production deployment:

1. **Use a proper WebSocket service** (Socket.io, Pusher, etc.)
2. **Implement proper authentication** for store settings updates
3. **Add rate limiting** for settings changes
4. **Implement audit logging** for settings changes
5. **Use environment variables** for WebSocket URLs
6. **Add monitoring and analytics** for settings usage

## 📞 Support

If you encounter issues:

1. **Check the troubleshooting guide** above
2. **Run the test scripts:**
   ```bash
   npm run test-store-settings
   npm run test-websocket
   ```
3. **Check browser console** for specific error messages
4. **Verify WebSocket server** is running
5. **Test with multiple browsers** to isolate issues

## 🎉 Success!

When everything is working correctly, you'll have:

- **Real-time store settings synchronization** across all app instances
- **Immediate feature visibility changes** when retailers update settings
- **Instant page access control** updates
- **Seamless customer experience** changes
- **Robust fallback mechanisms** for reliability
- **Clear status indicators** and user feedback
- **Cross-browser and cross-device** compatibility

## 📋 Testing Checklist

### Setup

- [ ] WebSocket server running (`npm run websocket`)
- [ ] Next.js app running (`npm run dev`)
- [ ] Multiple browser tabs open
- [ ] Retailer dashboard accessible
- [ ] Customer pages accessible

### Feature Testing

- [ ] Toggle "Add to Cart" feature
- [ ] Toggle "Wishlist" feature
- [ ] Toggle "Reviews" feature
- [ ] Toggle "Price Display" feature
- [ ] Toggle "Stock Display" feature

### Page Access Testing

- [ ] Toggle "Cart" page access
- [ ] Toggle "Wishlist" page access
- [ ] Toggle "Customer Dashboard" access

### Customer Experience Testing

- [ ] Toggle "Show Prices" setting
- [ ] Toggle "Show Stock" setting
- [ ] Toggle "Allow Guest Browsing" setting

### Real-Time Sync Testing

- [ ] Changes broadcast to all instances
- [ ] Toast notifications appear
- [ ] UI updates immediately
- [ ] No page refresh required
- [ ] Fallback polling works when WebSocket fails
