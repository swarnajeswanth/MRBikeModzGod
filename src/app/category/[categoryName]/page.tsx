// app/category/[categoryName]/page.tsx

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryClient from "@/components/Category/CategoryClient";

// Define the props type for the main page function
interface PageProps {
  params: {
    categoryName: string;
  };
}

// ✅ Page component — standard sync usage of params is fine
export default function CategoryPage({ params }: any) {
  return (
    <>
      <Header />
      <CategoryClient categoryName={params.categoryName} />
      <Footer />
    </>
  );
}

// ✅ generateMetadata — THIS is where you must await `params`
export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryName: string }>;
}) {
  const { categoryName } = await params;

  return {
    title: `Category: ${categoryName}`,
    description: `Browse high-quality products in the ${categoryName} category.`,
  };
}
