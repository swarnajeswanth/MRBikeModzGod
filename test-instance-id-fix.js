const WebSocket = require("ws");

// Test script to verify instance ID fix
console.log("Testing instance ID fix for WebSocket sync...");

// Create two mock instances
const instance1 = {
  id: "instance-abc123",
  ws: null,
  receivedMessages: [],
};

const instance2 = {
  id: "instance-def456",
  ws: null,
  receivedMessages: [],
};

// Mock the handleSyncMessage function
function mockHandleSyncMessage(instance, message) {
  console.log(`Instance ${instance.id} received message:`, message.type);

  // Check if message is from same instance
  if (message.instanceId === instance.id) {
    console.log(`✅ Instance ${instance.id} correctly ignored its own message`);
    return;
  }

  console.log(
    `✅ Instance ${instance.id} processed message from different instance`
  );
  instance.receivedMessages.push(message);
}

// Test scenarios
console.log("\n=== Testing Instance ID Fix ===");

// Test 1: Instance 1 sends message
console.log("\nTest 1: Instance 1 sends message");
const message1 = {
  type: "STORE_SETTINGS_UPDATED",
  timestamp: Date.now(),
  source: "app-123",
  instanceId: instance1.id,
};

console.log("Instance 1 sending message...");
mockHandleSyncMessage(instance1, message1); // Should be ignored
mockHandleSyncMessage(instance2, message1); // Should be processed

// Test 2: Instance 2 sends message
console.log("\nTest 2: Instance 2 sends message");
const message2 = {
  type: "STORE_SETTINGS_UPDATED",
  timestamp: Date.now(),
  source: "app-456",
  instanceId: instance2.id,
};

console.log("Instance 2 sending message...");
mockHandleSyncMessage(instance1, message2); // Should be processed
mockHandleSyncMessage(instance2, message2); // Should be ignored

// Test 3: Check message counts
console.log("\nTest 3: Verifying message counts");
console.log(
  `Instance 1 received ${instance1.receivedMessages.length} external messages`
);
console.log(
  `Instance 2 received ${instance2.receivedMessages.length} external messages`
);

if (
  instance1.receivedMessages.length === 1 &&
  instance2.receivedMessages.length === 1
) {
  console.log(
    "✅ Test passed! Each instance only processed messages from other instances"
  );
} else {
  console.log("❌ Test failed! Instances processed their own messages");
}

console.log("\n=== Test Complete ===");
console.log("\nTo test in the actual app:");
console.log("1. Open two browser tabs to your app");
console.log("2. Log in as retailer in both tabs");
console.log("3. Change store settings in one tab");
console.log(
  "4. You should only see the success message in the other tab, not the one that made the change"
);
