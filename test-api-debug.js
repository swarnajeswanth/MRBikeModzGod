// Test script to debug API issues
const https = require("https");
const http = require("http");

console.log("Testing API endpoints...");

// Test 1: Check if server is responding
function testServer() {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/products",
        method: "GET",
      },
      (res) => {
        console.log(`✅ Server responding: ${res.statusCode}`);
        resolve(res.statusCode);
      }
    );

    req.on("error", (err) => {
      console.log(`❌ Server error: ${err.message}`);
      reject(err);
    });

    req.end();
  });
}

// Test 2: Test seed-products endpoint
function testSeedProducts() {
  return new Promise((resolve, reject) => {
    const postData = "";

    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/seed-products",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          console.log(`✅ Seed products response: ${res.statusCode}`);
          console.log(`Response: ${data}`);
          resolve({ statusCode: res.statusCode, data });
        });
      }
    );

    req.on("error", (err) => {
      console.log(`❌ Seed products error: ${err.message}`);
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// Test 3: Test products endpoint
function testProducts() {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/products",
        method: "GET",
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          console.log(`✅ Products response: ${res.statusCode}`);
          console.log(`Response length: ${data.length} characters`);
          resolve({ statusCode: res.statusCode, data });
        });
      }
    );

    req.on("error", (err) => {
      console.log(`❌ Products error: ${err.message}`);
      reject(err);
    });

    req.end();
  });
}

// Run tests
async function runTests() {
  try {
    console.log("\n=== Testing Server Response ===");
    await testServer();

    console.log("\n=== Testing Products Endpoint ===");
    await testProducts();

    console.log("\n=== Testing Seed Products Endpoint ===");
    await testSeedProducts();

    console.log("\n✅ All tests completed!");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
  }
}

runTests();
