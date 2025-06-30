// app/category/[categoryName]/page.tsx

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryClient from "@/components/CategoryClient";

interface PageProps {
  params: {
    categoryName: string;
  };
}

export default async function CategoryPage({ params }: PageProps) {
  return (
    <>
      <Header />
      <CategoryClient categoryName={params.categoryName} />
      <Footer />
    </>
  );
}
