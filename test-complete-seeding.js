// Comprehensive test for real-time seeding system
const http = require("http");
const WebSocket = require("ws");

console.log("🧪 Testing Complete Real-Time Seeding System");
console.log("=============================================");

// Test 1: API Endpoints
async function testAPIEndpoints() {
  console.log("\n📡 Testing API Endpoints...");

  try {
    // Test seed-products endpoint
    const seedResponse = await new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: "localhost",
          port: 3000,
          path: "/api/seed-products",
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            const result = JSON.parse(data);
            console.log(
              `✅ Seed Products API: ${res.statusCode} - ${result.message}`
            );
            console.log(`   Products seeded: ${result.count}`);
            console.log(`   Categories: ${result.categories.join(", ")}`);
            resolve(result);
          });
        }
      );
      req.on("error", reject);
      req.write("");
      req.end();
    });

    // Test products endpoint
    const productsResponse = await new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: "localhost",
          port: 3000,
          path: "/api/products",
          method: "GET",
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            const products = JSON.parse(data);
            console.log(
              `✅ Products API: ${res.statusCode} - ${products.length} products loaded`
            );
            resolve(products);
          });
        }
      );
      req.on("error", reject);
      req.end();
    });

    return { seedResponse, productsResponse };
  } catch (error) {
    console.log(`❌ API Test Failed: ${error.message}`);
    throw error;
  }
}

// Test 2: WebSocket Real-Time Sync
function testWebSocketSync() {
  return new Promise((resolve, reject) => {
    console.log("\n🔗 Testing WebSocket Real-Time Sync...");

    const instances = [];
    let receivedMessages = 0;
    const expectedMessages = 2; // 2 other instances should receive the message

    // Create 3 test instances
    for (let i = 1; i <= 3; i++) {
      const ws = new WebSocket("ws://localhost:3001/sync");

      ws.on("open", () => {
        console.log(`✅ Instance ${i} connected`);
      });

      ws.on("message", (data) => {
        try {
          const message = JSON.parse(data);
          if (message.type === "PRODUCTS_UPDATED") {
            console.log(
              `📨 Instance ${i} received: ${message.type} from ${message.source}`
            );
            receivedMessages++;

            if (receivedMessages === expectedMessages) {
              console.log(`✅ All instances received the broadcast message`);
              resolve();
            }
          }
        } catch (error) {
          console.error(`❌ Instance ${i} failed to parse message:`, error);
        }
      });

      ws.on("error", (error) => {
        console.error(`❌ Instance ${i} WebSocket error:`, error.message);
      });

      instances.push(ws);
    }

    // Wait for connections to establish, then broadcast
    setTimeout(() => {
      if (instances[0].readyState === WebSocket.OPEN) {
        const testMessage = {
          type: "PRODUCTS_UPDATED",
          timestamp: Date.now(),
          source: "test-seeding-system",
          instanceId: "test-instance-1",
        };

        console.log("📤 Broadcasting PRODUCTS_UPDATED message...");
        instances[0].send(JSON.stringify(testMessage));

        // Clean up after test
        setTimeout(() => {
          instances.forEach((ws, index) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.close();
            }
          });

          if (receivedMessages < expectedMessages) {
            reject(
              new Error(
                `Only ${receivedMessages}/${expectedMessages} instances received the message`
              )
            );
          }
        }, 2000);
      } else {
        reject(new Error("WebSocket connection not ready"));
      }
    }, 2000);
  });
}

// Test 3: Complete End-to-End Test
async function testEndToEnd() {
  console.log("\n🔄 Testing End-to-End Seeding Process...");

  try {
    // Step 1: Seed products via API
    console.log("Step 1: Seeding products via API...");
    const seedResult = await new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: "localhost",
          port: 3000,
          path: "/api/seed-products",
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            const result = JSON.parse(data);
            console.log(`   ✅ Products seeded: ${result.count} products`);
            resolve(result);
          });
        }
      );
      req.on("error", reject);
      req.write("");
      req.end();
    });

    // Step 2: Verify products are in database
    console.log("Step 2: Verifying products in database...");
    const products = await new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: "localhost",
          port: 3000,
          path: "/api/products",
          method: "GET",
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            const products = JSON.parse(data);
            console.log(`   ✅ Products loaded: ${products.length} products`);
            resolve(products);
          });
        }
      );
      req.on("error", reject);
      req.end();
    });

    // Step 3: Test real-time broadcast
    console.log("Step 3: Testing real-time broadcast...");
    await testWebSocketSync();

    console.log("✅ End-to-End Test Completed Successfully!");
    return { seedResult, products };
  } catch (error) {
    console.log(`❌ End-to-End Test Failed: ${error.message}`);
    throw error;
  }
}

// Run all tests
async function runAllTests() {
  try {
    console.log("🚀 Starting comprehensive real-time seeding tests...\n");

    // Test 1: API Endpoints
    await testAPIEndpoints();

    // Test 2: WebSocket Sync
    await testWebSocketSync();

    // Test 3: End-to-End
    await testEndToEnd();

    console.log("\n🎉 ALL TESTS PASSED!");
    console.log("\n📋 Summary:");
    console.log("   ✅ API endpoints working");
    console.log("   ✅ WebSocket real-time sync working");
    console.log("   ✅ End-to-end seeding process working");
    console.log("   ✅ Database updates working");
    console.log("   ✅ Real-time broadcast working");

    console.log("\n🎯 Next Steps:");
    console.log("   1. Open multiple browser tabs to http://localhost:3000");
    console.log("   2. Navigate to /retailer-dashboard in each tab");
    console.log("   3. Click 'Seed Products' in one tab");
    console.log("   4. Watch for real-time updates in other tabs");
  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("   1. Check if Next.js server is running on port 3000");
    console.log("   2. Check if WebSocket server is running on port 3001");
    console.log("   3. Check MongoDB connection");
    console.log("   4. Check browser console for errors");
  }
}

runAllTests();
