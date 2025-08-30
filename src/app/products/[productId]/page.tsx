
'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getSupabase } from '@/lib/supabase';
import type { Product, ProductVariant } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle, Minus, Plus, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { SupabaseClient } from '@supabase/supabase-js';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

function ProductDetailPageContent() {
  const params = useParams();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    try {
      const supabaseClient = getSupabase();
      setSupabase(supabaseClient);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  }, []);

  const handleAddToCart = useCallback(() => {
    if (product && selectedVariant) {
      try {
        addToCart(product, quantity);
        toast({
          title: "Added to Cart! 🛒",
          description: `${quantity} x ${product.name} (${selectedVariant.name}) added.`,
        });
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Oh no! Something went wrong.",
          description: err.message,
        });
      }
    }
  }, [product, selectedVariant, quantity, addToCart, toast]);

  const handleQuantityChange = useCallback((amount: number) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
  }, []);
  
  const handleVariantSelect = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!supabase || !productId) return;
      try {
        setLoading(true);
        setError(null);

        const { data, error: productError } = await supabase
          .from('products')
          .select(`
            *,
            product_variants(*)
          `)
          .eq('id', productId)
          .single();

        if (productError) throw productError;

        const productData = {
          ...data,
          name: data.name,
          imageUrl: data.image_url,
          variants: data.product_variants.map((v: any) => ({
            ...v,
            price: v.price_in_cents,
            sale_price: v.sale_price_in_cents,
            inventory_quantity: v.inventory_quantity
          }))
        } as Product;
        
        setProduct(productData);
        if (productData.variants && productData.variants.length > 0) {
            setSelectedVariant(productData.variants[0]);
        }

      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (supabase) {
        fetchProductData();
    }
  }, [productId, supabase]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <XCircle className="mx-auto h-16 w-16 mb-4 text-destructive" />
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">{error || "We couldn't find the product you're looking for."}</p>
        <Button asChild variant="outline">
            <Link href="/products">
                <ArrowLeft size={16} className="mr-2"/>
                Back to Products
            </Link>
        </Button>
      </div>
    );
  }
  
  const displayPrice = selectedVariant ? (selectedVariant.sale_price ?? selectedVariant.price) / 100 : product.price;
  const originalPrice = selectedVariant && selectedVariant.sale_price ? selectedVariant.price / 100 : null;
  const availableStock = selectedVariant ? selectedVariant.inventory_quantity : 0;
  const canAddToCart = quantity <= availableStock;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost">
           <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent">
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 glass-card p-6 md:p-8 rounded-2xl">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="relative overflow-hidden rounded-lg shadow-lg h-96 md:h-[500px]">
              <Image
                src={product.imageUrl || placeholderImage}
                alt={product.name}
                fill
                className="w-full h-full object-cover"
              />
               {product.ribbon_text && (
                <div className="absolute top-4 left-4 bg-pink-500/90 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  {product.ribbon_text}
                </div>
              )}
            </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-lg text-muted-foreground mb-4">{product.subtitle}</p>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-accent">${displayPrice.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-2xl text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
            )}
          </div>
          
          <p className="text-muted-foreground mb-6">{product.description}</p>

          {product.variants?.length > 1 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">{product.variants[0].name || "Variant"}</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(variant => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                    onClick={() => handleVariantSelect(variant)}
                  >
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-full p-1">
              <Button onClick={() => handleQuantityChange(-1)} variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-muted"><Minus size={16} /></Button>
              <span className="w-10 text-center font-bold">{quantity}</span>
              <Button onClick={() => handleQuantityChange(1)} variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-muted"><Plus size={16} /></Button>
            </div>
          </div>

          <div className="mt-auto">
            <Button onClick={handleAddToCart} size="lg" className="w-full font-semibold py-3 text-lg" disabled={!canAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>

            {canAddToCart ? (
              <p className="text-sm text-green-500 mt-3 flex items-center justify-center gap-2">
                <CheckCircle size={16} /> {availableStock} in stock!
              </p>
            ) : (
               <p className="text-sm text-yellow-400 mt-3 flex items-center justify-center gap-2">
                <XCircle size={16} /> Not enough stock. Only {availableStock} left.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductDetailPageContent />
        </Suspense>
    )
}
