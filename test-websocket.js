const WebSocket = require("ws");

console.log("Testing WebSocket connection...");

// Use environment variable for WebSocket URL (Railway compatible)
const wsUrl =
  process.env.NEXT_PUBLIC_WS_URL ||
  "wss://websocket-server-production-ffd1.up.railway.app/sync";
const ws = new WebSocket(wsUrl);

ws.on("open", () => {
  console.log("✅ WebSocket connection successful!");
  console.log("Server is running and accepting connections.");

  // Send a test message
  ws.send(
    JSON.stringify({
      type: "TEST",
      message: "Hello from test client",
      timestamp: Date.now(),
    })
  );

  // Close the connection after 2 seconds
  setTimeout(() => {
    ws.close();
    process.exit(0);
  }, 2000);
});

ws.on("message", (data) => {
  try {
    const message = JSON.parse(data);
    console.log("📨 Received message:", message);
  } catch (error) {
    console.log("📨 Received raw message:", data.toString());
  }
});

ws.on("error", (error) => {
  console.log("❌ WebSocket connection failed!");
  console.log("Make sure the WebSocket server is running:");
  console.log("  npm run websocket");
  console.log("  or");
  console.log("  node websocket-server.js");
  process.exit(1);
});

ws.on("close", () => {
  console.log("🔌 WebSocket connection closed");
});

// Timeout after 5 seconds
setTimeout(() => {
  console.log("⏰ Test timeout - WebSocket server may not be running");
  process.exit(1);
}, 5000);
