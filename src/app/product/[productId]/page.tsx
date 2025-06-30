// app/product/[productTitle]/page.tsx
import ProductPage from "@/components/SingleProductPage";

interface Props {
  params: { productTitle: string };
}

export default function Product() {
  return <ProductPage />;
}
