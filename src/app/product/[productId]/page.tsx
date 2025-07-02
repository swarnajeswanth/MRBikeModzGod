// app/product/[productTitle]/page.tsx
import PageTransitionWrapper from "@/components/Loaders/PageTransitionWrapper";
import ProductPage from "@/components/SingleProductPage";

interface Props {
  params: { productTitle: string };
}

export default function Product() {
  return <ProductPage />;
}
