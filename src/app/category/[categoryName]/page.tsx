// app/category/[categoryName]/page.tsx

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryClient from "@/components/CategoryClient";

interface CategoryPageProps {
  params: {
    categoryName: string;
  };
}

// Make the function `async` to satisfy Next.js's PageProps signature
export default async function CategoryPage({ params }: CategoryPageProps) {
  return (
    <>
      <Header />
      <CategoryClient categoryName={params.categoryName} />
      <Footer />
    </>
  );
}
