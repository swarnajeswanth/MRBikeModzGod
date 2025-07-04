// app/category/[categoryName]/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryClient from "@/components/CategoryClient";

interface PageProps {
  params: {
    categoryName: string;
  };
}

export default function CategoryPage({ params: any }: any) {
  const categoryname: string = "engine-parts";
  return (
    <>
      <Header />
      <CategoryClient categoryName={categoryname} />
      <Footer />
    </>
  );
}
