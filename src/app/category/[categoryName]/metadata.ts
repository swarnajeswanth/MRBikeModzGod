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
