// app/category/[categoryName]/page.tsx

import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryClient from "@/components/CategoryClient";
import LoadingSpinner from "@/components/Loaders/LoadingSpinner";

interface PageProps {
  params: {
    categoryName: string;
  };
}

const CategoryPage = ({ params }: PageProps) => {
  return (
    <>
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <CategoryClient categoryName={params.categoryName} />
      </Suspense>
      <Footer />
    </>
  );
};

export default CategoryPage;
