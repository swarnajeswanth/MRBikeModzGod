export async function generateMetadata({
  params,
}: {
  params: { productId: string };
}) {
  const { productId } = params;

  return {
    title: `Product: ${productId}`,
    description: `View details for product ${productId}.`,
  };
}
