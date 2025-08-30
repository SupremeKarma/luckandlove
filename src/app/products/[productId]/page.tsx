
import { getSupabase } from '@/lib/supabase';
import { Suspense } from 'react';
import ProductClientPage from './ProductClientPage';

export async function generateStaticParams() {
  const supabase = getSupabase();
  const { data: products, error } = await supabase.from('products').select('id');

  if (error || !products) {
    return [];
  }

  return products.map((product) => ({
    productId: product.id,
  }));
}

export default function ProductDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductClientPage />
        </Suspense>
    )
}
