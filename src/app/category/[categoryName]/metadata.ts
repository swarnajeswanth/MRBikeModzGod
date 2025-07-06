export async function generateMetadata({
  params,
}: {
  params: { categoryName: string };
}) {
  const { categoryName } = params;

  return {
    title: `Category: ${categoryName}`,
    description: `Browse high-quality products in the ${categoryName} category.`,
  };
}
