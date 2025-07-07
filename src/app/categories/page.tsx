import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AllCategoriesClient from "@/components/Category/AllCategoriesClient";
import GuestAccessGuard from "@/components/GuestAccessGuard";

export default function AllCategoriesPage() {
  return (
    <GuestAccessGuard>
      <AllCategoriesClient />
    </GuestAccessGuard>
  );
}
