// app/category/[categoryName]/page.tsx

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryClient from "@/components/CategoryClient";

// ✅ Use this exact signature — inline the type!
export default async function CategoryPage({
  params,
}: {
  params: { categoryName: string };
}) {
  return (
    <>
      <Header />
      <CategoryClient categoryName={params.categoryName} />
      <Footer />
    </>
  );
}
