const WebSocket = require("ws");

console.log("🧪 Testing Real-Time Sync System");
console.log("==================================");

// Simulate multiple browser instances
const instances = [];

function createInstance(id) {
  // Use environment variable for WebSocket URL (Railway compatible)
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/sync";
  const ws = new WebSocket(wsUrl);

  ws.on("open", () => {
    console.log(`✅ Instance ${id} connected`);
  });

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      if (message.type === "CONNECTED") {
        console.log(`📨 Instance ${id} received welcome message`);
      } else {
        console.log(
          `📨 Instance ${id} received: ${message.type} from ${message.source}`
        );
      }
    } catch (error) {
      console.error(`❌ Instance ${id} failed to parse message:`, error);
    }
  });

  ws.on("close", () => {
    console.log(`🔌 Instance ${id} disconnected`);
  });

  ws.on("error", (error) => {
    console.error(`❌ Instance ${id} error:`, error.message);
  });

  return ws;
}

// Create 3 test instances
console.log("\n🔗 Creating test instances...");
for (let i = 1; i <= 3; i++) {
  instances.push(createInstance(i));
}

// Wait for connections to establish
setTimeout(() => {
  console.log("\n📤 Testing broadcast functionality...");

  // Simulate a data update from instance 1
  if (instances[0].readyState === WebSocket.OPEN) {
    const testMessage = {
      type: "PRODUCTS_UPDATED",
      timestamp: Date.now(),
      source: "test-instance-1",
    };

    console.log("📤 Instance 1 broadcasting PRODUCTS_UPDATED...");
    instances[0].send(JSON.stringify(testMessage));
  }

  // Wait for messages to be received
  setTimeout(() => {
    console.log("\n🧹 Cleaning up...");
    instances.forEach((ws, index) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });

    setTimeout(() => {
      console.log("✅ Test completed!");
      process.exit(0);
    }, 1000);
  }, 2000);
}, 2000);
