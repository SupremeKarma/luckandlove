
import { getSupabase } from '@/lib/supabase';
import type { Product, Shop } from '@/lib/types';
import ShopDetailClientPage from './shop-detail-client-page';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try {
    const supabase = getSupabase();
    const { data: shops } = await supabase.from('shops').select('id');

    if (!shops) {
      return [];
    }

    return shops.map((shop) => ({
      shopId: shop.id.toString(),
    }));
  } catch (error) {
    console.error("Failed to generate static params for shops", error);
    return [];
  }
}

async function getShopAndProducts(shopId: string): Promise<{ shop: Shop; products: Product[] } | null> {
  if (!shopId) return null;
  
  try {
    const supabase = getSupabase();
    
    // Fetch shop details
    const { data: shopData, error: shopError } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .single();

    if (shopError || !shopData) {
      console.error(`Shop fetch failed for ID ${shopId}:`, shopError?.message);
      return null;
    }

    // Fetch products for the shop
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (productsError) {
      console.error(`Products fetch failed for shop ID ${shopId}:`, productsError.message);
      // We can decide to return the shop even if products fail to load
    }
    
    const shop = { ...shopData, imageUrl: shopData.image_url, deliveryTimeMinutes: shopData.delivery_time_minutes, deliveryFee: shopData.delivery_fee } as Shop;
    const products = (productsData || []).map(p => ({ ...p, imageUrl: p.image_url })) as Product[];

    return { shop, products };
  } catch (err: any) {
    console.error(`Failed to fetch shop details for ID ${shopId}: ${err.message}`);
    return null;
  }
}

export default async function ShopDetailPage({ params }: { params: { shopId: string } }) {
  const data = await getShopAndProducts(params.shopId);

  if (!data) {
    notFound();
  }

  return <ShopDetailClientPage shop={data.shop} products={data.products} />;
}
