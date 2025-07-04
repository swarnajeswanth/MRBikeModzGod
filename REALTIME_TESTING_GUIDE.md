# Real-Time Synchronization Testing Guide

## 🎯 Overview

This guide helps you test the real-time synchronization system to ensure that when a retailer seeds products, the changes are immediately reflected across all app instances (different browsers, tabs, or devices).

## 🚀 Quick Test Setup

### 1. Start the Full System

```bash
npm run dev:full
```

This starts both:

- Next.js app on http://localhost:3000
- WebSocket server on ws://localhost:3001

### 2. Test WebSocket Connection

```bash
npm run test-wealtime
```

You should see:

```
🧪 Testing Real-Time Sync System
✅ Instance 1 connected
✅ Instance 2 connected
✅ Instance 3 connected
📤 Instance 1 broadcasting PRODUCTS_UPDATED...
📨 Instance 2 received: PRODUCTS_UPDATED from test-instance-1
📨 Instance 3 received: PRODUCTS_UPDATED from test-instance-1
✅ Test completed!
```

## 🧪 Manual Testing Steps

### Test 1: Multiple Browser Tabs

1. **Open multiple tabs** to http://localhost:3000
2. **Navigate to retailer dashboard** in each tab: `/retailer-dashboard`
3. **Check connection status** in the SeedDataManager
4. **Seed products** in one tab
5. **Watch for real-time updates** in other tabs

### Test 2: Different Browsers

1. **Open Chrome** and navigate to http://localhost:3000/retailer-dashboard
2. **Open Firefox** and navigate to http://localhost:3000/retailer-dashboard
3. **Seed products** in Chrome
4. **Watch for updates** in Firefox

### Test 3: Different Devices

1. **Open on desktop** browser
2. **Open on mobile** browser (or use browser dev tools mobile view)
3. **Seed data** on desktop
4. **Watch for updates** on mobile

## 📊 Expected Behavior

### ✅ Successful Real-Time Sync

When seeding works properly, you should see:

1. **In the seeding instance:**

   - Toast notification: "Products seeded successfully! All app instances updated."
   - Console log: "Broadcasting products update to other instances"
   - Console log: "Broadcasting update: PRODUCTS_UPDATED"

2. **In other instances:**

   - Toast notification: "Products updated from another instance"
   - Product list updates immediately
   - No page refresh needed

3. **In WebSocket server console:**
   - "Received message: { type: 'PRODUCTS_UPDATED', ... }"
   - "Broadcasted to X other clients"

### ❌ Issues to Watch For

1. **No real-time updates:**

   - Check if WebSocket server is running
   - Look for "WebSocket not connected" in console
   - Verify connection status in SeedDataManager

2. **Broadcast function not available:**

   - Check browser console for WebSocket connection errors
   - Ensure WebSocket server is on port 3001
   - Restart the WebSocket server

3. **Data not syncing:**
   - Check if database connection is working
   - Verify API endpoints are responding
   - Check for network errors in browser dev tools

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

### 2. Check Broadcast Function

In browser console, type:

```javascript
typeof window.broadcastDataUpdate;
```

Should return: `"function"`

If it returns: `"undefined"`, the WebSocket isn't connected.

### 3. Check Server Logs

In the WebSocket server terminal, you should see:

```
WebSocket server started on port 3001
New client connected
Received message: { type: 'PRODUCTS_UPDATED', ... }
Broadcasted to 2 other clients
```

### 4. Test API Endpoints

Check if the seeding API is working:

```bash
curl -X POST http://localhost:3000/api/seed-products
```

Should return:

```json
{
  "success": true,
  "message": "Products seeded successfully!",
  "count": 20,
  "categories": ["bike", "accessories", "keychains", "toys"]
}
```

## 🛠️ Troubleshooting

### Issue: No Real-Time Updates

**Symptoms:**

- Changes only appear after page refresh
- No toast notifications from other instances
- Console shows "WebSocket not connected"

**Solutions:**

1. **Start WebSocket server:**

   ```bash
   npm run websocket
   ```

2. **Check port availability:**

   ```bash
   # Windows
   netstat -ano | findstr :3001

   # Unix/Linux
   lsof -i :3001
   ```

3. **Restart everything:**
   ```bash
   # Stop all processes
   # Then restart
   npm run dev:full
   ```

### Issue: Broadcast Function Not Available

**Symptoms:**

- Console shows "Broadcast function not available"
- Connection status shows "Not Connected"

**Solutions:**

1. **Check WebSocket connection:**

   - Look for "Real-time sync connected" in console
   - If not present, restart WebSocket server

2. **Check for errors:**

   - Look for WebSocket connection errors
   - Check if port 3001 is blocked by firewall

3. **Test connection:**
   ```bash
   npm run test-websocket
   ```

### Issue: Data Not Syncing

**Symptoms:**

- Toast notifications appear but data doesn't update
- Products list remains the same

**Solutions:**

1. **Check Redux store:**

   - Open Redux DevTools
   - Verify products are being fetched
   - Check for API errors

2. **Check API endpoints:**

   - Test `/api/products` endpoint
   - Verify database connection
   - Check MongoDB logs

3. **Manual refresh:**
   - Use "Refresh Data" button in SeedDataManager
   - Check if manual refresh works

## 📈 Performance Testing

### Test Multiple Instances

1. **Open 5+ browser tabs** to the retailer dashboard
2. **Seed products** in one tab
3. **Monitor timing** - updates should appear within 1-2 seconds
4. **Check server logs** for broadcast counts

### Test Large Data Sets

1. **Seed products multiple times** to create large datasets
2. **Monitor performance** across instances
3. **Check memory usage** in browser dev tools
4. **Verify all instances** receive updates

### Test Network Issues

1. **Disconnect network** temporarily
2. **Seed data** (should fail gracefully)
3. **Reconnect network**
4. **Verify fallback polling** works

## 🎯 Success Criteria

### ✅ Real-Time Sync Working

- [ ] WebSocket server running on port 3001
- [ ] Browser console shows "Real-time sync connected"
- [ ] SeedDataManager shows "Real-time sync active"
- [ ] Seeding in one instance updates all others within 2 seconds
- [ ] Toast notifications appear in all instances
- [ ] No page refresh needed for updates

### ✅ Fallback System Working

- [ ] System works when WebSocket is down
- [ ] Polling updates every 30 seconds
- [ ] Graceful degradation with status indicators
- [ ] Manual refresh button works

### ✅ Error Handling

- [ ] Network errors handled gracefully
- [ ] Database errors show user-friendly messages
- [ ] WebSocket failures don't break the app
- [ ] Console logging for debugging

## 🚀 Production Considerations

For production deployment:

1. **Use a proper WebSocket service** (Socket.io, Pusher, etc.)
2. **Implement proper error logging**
3. **Add monitoring and analytics**
4. **Consider load balancing** for multiple WebSocket servers
5. **Use environment variables** for WebSocket URLs
6. **Implement rate limiting** for broadcast messages

## 📞 Support

If you encounter issues:

1. **Check the troubleshooting guide** above
2. **Run the test scripts:**
   ```bash
   npm run test-websocket
   npm run test-realtime
   ```
3. **Check browser console** for specific error messages
4. **Verify WebSocket server** is running
5. **Test with multiple browsers** to isolate issues

## 🎉 Success!

When everything is working correctly, you'll have:

- **Real-time data synchronization** across all app instances
- **Immediate updates** when retailers seed products
- **Robust fallback mechanisms** for reliability
- **Clear status indicators** and user feedback
- **Cross-browser and cross-device** compatibility
