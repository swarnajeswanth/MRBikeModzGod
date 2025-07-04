// Test script to verify product creation
const testProductCreation = async () => {
  try {
    console.log("Testing product creation...");

    const testProduct = {
      name: "Test Product",
      title: "Test Product Title",
      category: "Test Category",
      price: 99.99,
      originalPrice: 129.99,
      discount: "20% OFF",
      stockCount: 10,
      inStock: true,
      rating: 4.5,
      reviews: 5,
      description: "This is a test product",
      features: ["Feature 1", "Feature 2"],
      specifications: {
        Material: "Test Material",
        "Temperature Range": "0-100°C",
        Compatibility: "Universal",
        Warranty: "1 Year",
      },
      label: "NEW",
      labelType: "new",
      backgroundColor: "#1f2937",
      images: ["https://example.com/image1.jpg"],
    };

    console.log("Sending test product data:", testProduct);

    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testProduct),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const result = await response.json();
    console.log("Response body:", result);

    if (response.ok) {
      console.log("✅ Product creation successful!");
      console.log("Created product:", result.product);
    } else {
      console.log("❌ Product creation failed!");
      console.log("Error:", result);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
};

// Run the test
testProductCreation();
