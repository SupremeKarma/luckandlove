import { getProductRecommendations } from '@/ai/flows/product-recommendations';
import { PRODUCTS } from '@/lib/products';
import { ProductCard } from './product-card';

export async function ProductRecommendations() {
  let recommendedProductIds: string[] = [];
  try {
    const recommendationsOutput = await getProductRecommendations({
      browsingHistory: ['prod-1', 'prod-3', 'prod-9'],
      purchaseHistory: ['prod-12'],
      cartItems: [],
      numberOfRecommendations: 4,
    });
    recommendedProductIds = recommendationsOutput.productRecommendations || [];
  } catch (error) {
    console.error('Error getting product recommendations:', error);
    // Silently fail if the API key is not valid.
    // The component will render nothing.
  }

  const recommendedProducts = PRODUCTS.filter(p => recommendedProductIds.includes(p.id));

  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-3xl font-bold tracking-tight text-center">Recommended For You</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
