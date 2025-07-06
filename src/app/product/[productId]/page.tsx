// app/product/[productId]/page.tsx
import PageTransitionWrapper from "@/components/Loaders/PageTransitionWrapper";
import ProductPage from "@/components/SingleProductPage";
import GuestAccessGuard from "@/components/GuestAccessGuard";

interface Props {
  params: Promise<{ productId: string }>;
}

export default async function Product({ params }: Props) {
  const { productId } = await params;

  return (
    <GuestAccessGuard>
      <ProductPage />
    </GuestAccessGuard>
  );
}
