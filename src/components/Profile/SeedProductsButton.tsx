"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { seedProducts } from "../store/productSlice";
import { toast } from "react-hot-toast";
import { Database, Loader2 } from "lucide-react";

const SeedProductsButton = () => {
  const [seeding, setSeeding] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSeedProducts = async () => {
    if (
      window.confirm("This will add dummy products to the database. Continue?")
    ) {
      setSeeding(true);
      try {
        await dispatch(seedProducts()).unwrap();
        toast.success("Products seeded successfully!");
      } catch (error) {
        console.error("Failed to seed products:", error);
        toast.error("Failed to seed products");
      } finally {
        setSeeding(false);
      }
    }
  };

  return (
    <button
      onClick={handleSeedProducts}
      disabled={seeding}
      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {seeding ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Database className="h-4 w-4" />
      )}
      <span>{seeding ? "Seeding..." : "Seed Products"}</span>
    </button>
  );
};

export default SeedProductsButton;
