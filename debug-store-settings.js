// Debug script to check Redux state
console.log("=== Redux State Debug ===");

// Check localStorage
try {
  const persistedState = localStorage.getItem("persist:root");
  if (persistedState) {
    const parsedState = JSON.parse(persistedState);
    console.log("Persisted state keys:", Object.keys(parsedState));

    if (parsedState.storeSettings) {
      const storeSettings = JSON.parse(parsedState.storeSettings);
      console.log("Store Settings from localStorage:", storeSettings);
      console.log("Features:", storeSettings.features);
    } else {
      console.log("No storeSettings in persisted state");
    }
  } else {
    console.log("No persisted state found");
  }
} catch (error) {
  console.error("Error reading localStorage:", error);
}

// Check if window.store is available (for debugging)
if (typeof window !== "undefined" && window.store) {
  const currentState = window.store.getState();
  console.log("Current Redux state:", currentState);
  console.log("Store Settings from Redux:", currentState.storeSettings);
}

console.log("=== End Debug ===");
