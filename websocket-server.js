const WebSocket = require("ws");

// Create WebSocket server
const wss = new WebSocket.Server({ port: 3001 });

console.log("WebSocket server started on port 3001");

// Store connected clients
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("New client connected");
  clients.add(ws);

  // Send welcome message
  ws.send(
    JSON.stringify({
      type: "CONNECTED",
      message: "Connected to real-time sync server",
      timestamp: Date.now(),
    })
  );

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("Received message:", data);

      // Broadcast message to all other clients
      let broadcastCount = 0;
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
          broadcastCount++;
        }
      });
      console.log(`Broadcasted to ${broadcastCount} other clients`);
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clients.delete(ws);
  });
});

// Handle server shutdown
process.on("SIGINT", () => {
  console.log("Shutting down WebSocket server...");
  wss.close(() => {
    console.log("WebSocket server closed");
    process.exit(0);
  });
});

module.exports = wss;
