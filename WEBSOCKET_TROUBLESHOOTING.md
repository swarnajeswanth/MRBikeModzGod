# WebSocket Troubleshooting Guide

## Issue: WebSocket Connection Errors

If you're seeing WebSocket connection errors in the console, here's how to fix them:

### 🔧 **Quick Fix**

1. **Start the WebSocket server**:

   ```bash
   npm run websocket
   ```

2. **Or use the convenience scripts**:

   ```bash
   # Windows
   start-websocket.bat

   # Unix/Linux/Mac
   ./start-websocket.sh
   ```

### 🚨 **Common Issues & Solutions**

#### Issue 1: "WebSocket connection failed"

**Cause**: WebSocket server is not running
**Solution**: Start the WebSocket server on port 3001

#### Issue 2: "Max WebSocket connection attempts reached"

**Cause**: Server is not available after multiple attempts
**Solution**:

- Check if port 3001 is available
- Restart the WebSocket server
- Check firewall settings

#### Issue 3: Network requests being called repeatedly

**Cause**: WebSocket connection failures causing fallback polling
**Solution**: Start the WebSocket server to enable real-time sync

### 📊 **Connection Status Indicators**

The app shows connection status in the SeedDataManager:

- 🟢 **Real-time sync active**: WebSocket connected, real-time updates working
- 🟡 **Polling mode active**: WebSocket failed, using fallback polling
- 🔴 **No connection**: Neither WebSocket nor polling working

### 🔍 **Debug Steps**

1. **Check if WebSocket server is running**:

   ```bash
   # Should show "WebSocket server started on port 3001"
   npm run websocket
   ```

2. **Check browser console**:

   - Look for "Real-time sync connected" message
   - Check for WebSocket error messages

3. **Test WebSocket connection**:

   ```bash
   # Test if port 3001 is listening
   netstat -an | grep 3001
   ```

4. **Check firewall/antivirus**:
   - Ensure port 3001 is not blocked
   - Allow Node.js through firewall

### 🛠️ **Manual Testing**

1. **Start WebSocket server**:

   ```bash
   node websocket-server.js
   ```

2. **Open multiple browser tabs** to `http://localhost:3000`

3. **Navigate to retailer dashboard** and use SeedDataManager

4. **Seed some data** and watch for real-time updates across tabs

### 🔄 **Fallback Behavior**

If WebSocket fails, the system automatically:

- Attempts reconnection 3 times
- Falls back to polling every 30 seconds
- Shows appropriate status indicators
- Continues to work (just without real-time updates)

### 📝 **Log Messages to Watch For**

**Successful Connection**:

```
Real-time sync connected
```

**Connection Issues**:

```
WebSocket connection failed, will attempt fallback
Max WebSocket connection attempts reached, using polling fallback
Starting polling fallback mechanism
```

**Server Messages**:

```
WebSocket server started on port 3001
New client connected
Client disconnected
```

### 🚀 **Production Considerations**

For production deployment:

- Use a proper WebSocket service (Socket.io, Pusher, etc.)
- Implement proper error handling and logging
- Consider load balancing for multiple WebSocket servers
- Use environment variables for WebSocket URLs

### 📞 **Still Having Issues?**

1. **Check the console** for specific error messages
2. **Verify port 3001** is not used by another application
3. **Try a different port** by modifying `websocket-server.js`
4. **Check network connectivity** and firewall settings
5. **Restart both Next.js app and WebSocket server**

### 🎯 **Quick Commands Reference**

```bash
# Start everything together
npm run dev:full

# Start separately
npm run dev          # Next.js app
npm run websocket    # WebSocket server

# Windows convenience
start-websocket.bat

# Unix/Linux convenience
./start-websocket.sh
```
