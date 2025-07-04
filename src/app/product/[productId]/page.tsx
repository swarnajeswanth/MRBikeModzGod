// app/product/[productId]/page.tsx
import PageTransitionWrapper from "@/components/Loaders/PageTransitionWrapper";
import ProductPage from "@/components/SingleProductPage";

interface Props {
  params: { productId: string };
}

export default function Product() {
  return <ProductPage />;
}
