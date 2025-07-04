This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Option 1: Start Everything Together (Recommended)

```bash
npm run dev:full
```

This starts both the Next.js app and the WebSocket server for real-time synchronization.

### Option 2: Start Components Separately

**Terminal 1 - Next.js App:**

```bash
npm run dev
```

**Terminal 2 - WebSocket Server (for real-time sync):**

```bash
# Windows
start-websocket.bat

# Unix/Linux/Mac
chmod +x start-websocket.sh
./start-websocket.sh

# Or manually
npm run websocket
```

### Access the Application

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Note:** For real-time synchronization across multiple app instances, make sure the WebSocket server is running on port 3001.

## Real-Time Features

This application includes comprehensive real-time synchronization for:

- **Product Data**: When retailers seed products, changes are immediately reflected across all instances
- **Store Settings**: When retailers change store settings, updates are instantly applied to all customer instances
- **Reviews**: Review changes are synchronized in real-time across all app instances

### Testing Real-Time Features

```bash
# Test WebSocket connection
npm run test-websocket

# Test product/review synchronization
npm run test-realtime

# Test store settings synchronization
npm run test-store-settings
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🚀 Railway Deployment Guide

### 1. Deploy WebSocket Server to Railway

- Create a new Railway project and add your repo.
- Set up a new service for `websocket-server.js` (Node.js service).
- Railway will automatically set the `PORT` environment variable for you (no need to hardcode it).
- The WebSocket server will listen on `process.env.PORT` (already handled in your code).

### 2. Set Environment Variables

- In your Railway **frontend** service, set:
  - `NEXT_PUBLIC_WS_URL` to your Railway WebSocket endpoint, e.g.:
    - `wss://your-railway-app.up.railway.app/sync`
- In your Railway **websocket server** service, no extra variables are needed unless you want to override the port.

### 3. Update Client Code

- The client now uses `NEXT_PUBLIC_WS_URL` (with fallback to local dev):
  - `const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/sync";`
- This is already implemented in `src/components/RealTimeSync.tsx`, `src/components/store/index.ts`, and all test scripts.

### 4. Local Development

- You can still run everything locally with the default settings:
  - WebSocket server: `node websocket-server.js` (on port 3001)
  - Frontend: `npm run dev` (connects to ws://localhost:3001/sync)
- For local testing with a custom WebSocket URL, create a `.env` file with:
  - `NEXT_PUBLIC_WS_URL=ws://localhost:3001/sync`

### 5. Production/Cloud Usage

- When deployed, the frontend will connect to the Railway WebSocket endpoint using the value of `NEXT_PUBLIC_WS_URL`.
- No code changes are needed for switching between local and Railway deployments—just set the environment variable.

### 6. Troubleshooting

- If you see connection errors, check that both services are running and the URLs are correct.
- See `WEBSOCKET_TROUBLESHOOTING.md` for more help.
