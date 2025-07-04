"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

const SeedProductsButton = () => {
  const [seeding, setSeeding] = useState(false);

  const handleSeedProducts = async () => {
    setSeeding(true);
    try {
      const response = await fetch("/api/seed-products", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        // Optionally refresh the page or refetch products
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to seed products");
      }
    } catch (error) {
      toast.error("Failed to seed products");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <button
      onClick={handleSeedProducts}
      disabled={seeding}
      className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-md transition-colors"
    >
      {seeding ? "Seeding..." : "Seed Dummy Products"}
    </button>
  );
};

export default SeedProductsButton;
