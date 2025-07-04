const WebSocket = require("ws");

console.log("🧪 Testing Store Settings Real-Time Sync");
console.log("=========================================");

// Simulate retailer and customer instances
const instances = [];

function createInstance(id, type) {
  // Use environment variable for WebSocket URL (Railway compatible)
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/sync";
  const ws = new WebSocket(wsUrl);

  ws.on("open", () => {
    console.log(`✅ ${type} Instance ${id} connected`);
  });

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      if (message.type === "CONNECTED") {
        console.log(`📨 ${type} Instance ${id} received welcome message`);
      } else if (message.type === "STORE_SETTINGS_UPDATED") {
        console.log(
          `📨 ${type} Instance ${id} received: STORE_SETTINGS_UPDATED from ${message.source}`
        );
        console.log(
          `   → ${type} Instance ${id} should now refresh store settings`
        );
      } else {
        console.log(
          `📨 ${type} Instance ${id} received: ${message.type} from ${message.source}`
        );
      }
    } catch (error) {
      console.error(
        `❌ ${type} Instance ${id} failed to parse message:`,
        error
      );
    }
  });

  ws.on("close", () => {
    console.log(`🔌 ${type} Instance ${id} disconnected`);
  });

  ws.on("error", (error) => {
    console.error(`❌ ${type} Instance ${id} error:`, error.message);
  });

  return ws;
}

// Create test instances
console.log("\n🔗 Creating test instances...");
instances.push(createInstance(1, "Retailer")); // Retailer instance
instances.push(createInstance(2, "Customer")); // Customer instance 1
instances.push(createInstance(3, "Customer")); // Customer instance 2

// Wait for connections to establish
setTimeout(() => {
  console.log("\n📤 Testing store settings broadcast...");

  // Simulate a store settings update from retailer instance
  if (instances[0].readyState === WebSocket.OPEN) {
    const testMessage = {
      type: "STORE_SETTINGS_UPDATED",
      timestamp: Date.now(),
      source: "retailer-instance-1",
    };

    console.log(
      "📤 Retailer Instance 1 broadcasting STORE_SETTINGS_UPDATED..."
    );
    console.log("   → This simulates a retailer changing store settings");
    instances[0].send(JSON.stringify(testMessage));
  }

  // Wait for messages to be received
  setTimeout(() => {
    console.log("\n📊 Expected Behavior:");
    console.log(
      "   ✅ Customer instances should receive STORE_SETTINGS_UPDATED"
    );
    console.log("   ✅ Customer instances should refresh their store settings");
    console.log("   ✅ UI should update immediately without page refresh");
    console.log("   ✅ Features should be hidden/shown based on new settings");

    console.log("\n🧹 Cleaning up...");
    instances.forEach((ws, index) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });

    setTimeout(() => {
      console.log("✅ Store settings sync test completed!");
      console.log("\n🎯 To test manually:");
      console.log("   1. Open multiple browser tabs to /retailer-dashboard");
      console.log("   2. Change store settings in one tab");
      console.log("   3. Watch for real-time updates in other tabs");
      process.exit(0);
    }, 1000);
  }, 2000);
}, 2000);
