
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/firebase';
import type { Product } from '@/lib/types';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const supabase = getSupabase();

    const fetchProduct = async () => {
      if (!supabase) {
        console.error("Supabase client not available.");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) throw error;
        
        if (data) {
          setProduct({ ...data, imageUrl: data.image_url } as Product);
        } else {
          setError('Product not found.');
        }
      } catch (err: any) {
        setError(`Failed to fetch product: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center text-center text-xl text-muted-foreground">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center text-center text-xl text-red-500">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center text-center text-xl text-muted-foreground">
        Product not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg md:h-[500px]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            className="object-contain"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-2xl font-semibold text-blue-600">${product.price.toFixed(2)}</p>
          <Separator className="my-4" />
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          
          <div className="mt-6 space-y-4">
            <div className="text-sm font-medium">
              Category: <span className="text-muted-foreground">{product.category}</span>
            </div>
            <div className="text-sm font-medium">
              Availability: <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <Button
            className="mt-8 w-full md:w-auto"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? <ShoppingCart className="mr-2 h-4 w-4" /> : null}
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
}
