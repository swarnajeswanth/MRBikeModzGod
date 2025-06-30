// app/product/[productTitle]/page.tsx
import AllProductsPage from "@/components/SingleProductPage";

interface Props {
  params: { productTitle: string };
}

export default function Product() {
  return <AllProductsPage />;
}
