
import { getSupabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import ProductDetailClientPage from './product-detail-client-page';

export async function generateStaticParams() {
  try {
    const supabase = getSupabase();
    const { data: products } = await supabase.from('products').select('id');
    
    if (!products) {
      return [];
    }

    return products.map((product) => ({
      productId: product.id.toString(),
    }));
  } catch (error) {
    console.error("Failed to generate static params for products", error);
    return [];
  }
}

async function getProduct(productId: string): Promise<Product | null> {
    if (!productId) return null;
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (error) throw error;
        if (data) {
          return { ...data, imageUrl: data.image_url } as Product;
        }
        return null;
    } catch (err: any) {
        console.error(`Failed to fetch product: ${err.message}`);
        // In a server component, we might log this to a service
        return null;
    }
}

export default async function ProductDetailPage({ params }: { params: { productId: string } }) {
  const product = await getProduct(params.productId);

  if (!product) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center text-center text-xl text-muted-foreground">
        Product not found.
      </div>
    );
  }
  
  return <ProductDetailClientPage product={product} />;
}
