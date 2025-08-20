'use client';

import { useEffect, useState } from 'react';
import { getProductRecommendations } from '@/ai/flows/product-recommendations';
import { PRODUCTS } from '@/lib/products';
import { ProductCard } from './product-card';
import type { Product } from '@/lib/types';

export function ProductRecommendations() {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const recommendationsOutput = await getProductRecommendations({
          browsingHistory: ['prod-1', 'prod-3', 'prod-9'],
          purchaseHistory: ['prod-12'],
          cartItems: [],
          numberOfRecommendations: 4,
        });
        const recommendedProductIds = recommendationsOutput.productRecommendations || [];
        const products = PRODUCTS.filter(p => recommendedProductIds.includes(p.id));
        setRecommendedProducts(products);
      } catch (error) {
        console.error('Error getting product recommendations:', error);
        // Silently fail if the API key is not valid or other errors occur.
      }
    }

    fetchRecommendations();
  }, []);

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
