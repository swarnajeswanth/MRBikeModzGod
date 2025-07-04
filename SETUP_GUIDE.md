# Real-Time Seeding System Setup Guide

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB connection (for data persistence)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Full System (Recommended)

```bash
npm run dev:full
```

This starts both:

- Next.js app on http://localhost:3000
- WebSocket server on ws://localhost:3001

### 3. Test the Setup

```bash
# In a new terminal, test WebSocket connection
npm run test-websocket
```

You should see: `✅ WebSocket connection successful!`

## 🔧 Alternative Setup Methods

### Method 1: Separate Terminals

**Terminal 1 - Next.js App:**

```bash
npm run dev
```

**Terminal 2 - WebSocket Server:**

```bash
npm run websocket
```

### Method 2: Convenience Scripts

**Windows:**

```bash
start-websocket.bat
```

**Unix/Linux/Mac:**

```bash
chmod +x start-websocket.sh
./start-websocket.sh
```

## 📊 Using the Seeding System

### 1. Navigate to Retailer Dashboard

Open http://localhost:3000/retailer-dashboard

### 2. Use the SeedDataManager

- **Seed Products**: Adds dummy products to database
- **Seed Reviews**: Adds dummy reviews to database
- **Seed All Data**: Seeds both products and reviews
- **Refresh Data**: Syncs with latest database state

### 3. Monitor Connection Status

The interface shows real-time connection status:

- 🟢 **Real-time sync active**: WebSocket connected
- 🟡 **Polling mode active**: WebSocket failed, using fallback
- 🔴 **No connection**: Neither working

## 🧪 Testing Real-Time Updates

### Test 1: Multiple Browser Tabs

1. Open http://localhost:3000 in multiple browser tabs
2. Navigate to retailer dashboard in each tab
3. Seed data in one tab
4. Watch for real-time updates in other tabs

### Test 2: Different Browsers

1. Open the app in Chrome and Firefox
2. Seed data in one browser
3. Watch for updates in the other browser

### Test 3: WebSocket Connection

```bash
npm run test-websocket
```

## 🚨 Troubleshooting

### Issue: "concurrently is not recognized"

**Solution:**

```bash
npm install concurrently --save-dev
```

### Issue: WebSocket connection fails

**Solution:**

1. Check if WebSocket server is running:
   ```bash
   npm run websocket
   ```
2. Test connection:
   ```bash
   npm run test-websocket
   ```

### Issue: No real-time updates

**Solution:**

1. Ensure WebSocket server is running on port 3001
2. Check browser console for connection messages
3. Verify connection status in SeedDataManager

### Issue: Port 3001 already in use

**Solution:**

1. Find what's using the port:

   ```bash
   # Windows
   netstat -ano | findstr :3001

   # Unix/Linux
   lsof -i :3001
   ```

2. Kill the process or change the port in `websocket-server.js`

## 📁 File Structure

```
├── websocket-server.js          # WebSocket server
├── test-websocket.js           # WebSocket test script
├── start-websocket.bat         # Windows startup script
├── start-websocket.sh          # Unix/Linux startup script
├── src/
│   ├── components/
│   │   ├── RealTimeSync.tsx    # WebSocket client
│   │   ├── ConnectionStatus.tsx # Connection status display
│   │   └── Profile/
│   │       └── SeedDataManager.tsx # Main seeding interface
│   └── store/
│       ├── productSlice.ts     # Product Redux slice
│       └── ReviewSlice.ts      # Review Redux slice
└── package.json                # Dependencies and scripts
```

## 🔄 How It Works

### Data Flow

1. User clicks "Seed Products" in SeedDataManager
2. Redux thunk calls API endpoint
3. Database is updated with dummy data
4. Redux store is refreshed
5. WebSocket broadcasts update to all instances
6. Other instances receive update and refresh their stores
7. Toast notifications confirm success

### Fallback System

- If WebSocket fails, system uses polling every 30 seconds
- Maximum 3 reconnection attempts
- Graceful degradation ensures system always works

## 🎯 Success Indicators

### ✅ Everything Working

- WebSocket server shows: "WebSocket server started on port 3001"
- Browser console shows: "Real-time sync connected"
- SeedDataManager shows: "Real-time sync active"
- Data seeding works across multiple instances

### ⚠️ Partial Functionality

- SeedDataManager shows: "Polling mode active"
- System works but without real-time updates
- Data still syncs every 30 seconds

### ❌ Issues

- SeedDataManager shows: "No connection"
- Check WebSocket server and network connectivity

## 🚀 Production Deployment

For production, consider:

- Using a proper WebSocket service (Socket.io, Pusher)
- Environment variables for WebSocket URLs
- Load balancing for multiple WebSocket servers
- Proper error logging and monitoring

## 📞 Support

If you encounter issues:

1. Check the troubleshooting guide: `WEBSOCKET_TROUBLESHOOTING.md`
2. Verify all dependencies are installed
3. Test WebSocket connection with `npm run test-websocket`
4. Check browser console for error messages
5. Ensure MongoDB is connected and working

## 🎉 Success!

Once everything is working, you'll have:

- Real-time data synchronization across all app instances
- Seamless multi-user experience
- Robust fallback mechanisms
- Clear status indicators and feedback
