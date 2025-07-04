export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  return {
    title: `Product: ${productId}`,
    description: `View details for product ${productId}.`,
  };
}
