import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryClient from "@/components/Category/CategoryClient";
import GuestAccessGuard from "@/components/GuestAccessGuard";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryName: string }>;
}) {
  const { categoryName } = await params;

  return (
    <GuestAccessGuard>
      <CategoryClient categoryName={categoryName} />
    </GuestAccessGuard>
  );
}
