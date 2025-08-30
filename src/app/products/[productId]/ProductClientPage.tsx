"use client";

import * as React from "react";
import { getSupabase } from "@/lib/supabase";
import { mapProductRow, type Product } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { ProductVariant } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle, Minus, Plus, XCircle } from 'lucide-react';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

export default function ProductClientPage({ productId }: { productId: string }) {
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = React.useCallback(() => {
    if (product) {
      try {
        addToCart(product, { quantity, variant: selectedVariant });
        toast({
          title: "Added to Cart! 🛒",
          description: `${quantity} x ${product.name} ${selectedVariant ? `(${selectedVariant.name})` : ''} added.`,
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

  const handleQuantityChange = React.useCallback((amount: number) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
  }, []);
  
  const handleVariantSelect = React.useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  }, []);

  React.useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      try {
        const supabase = getSupabase();
        setLoading(true);
        setError(null);

        const { data: productData, error: productError } = await supabase
          .from('products')
          .select(`*`)
          .eq('id', productId)
          .single();

        if (productError) throw productError;
        if (!productData) throw new Error("Product not found");

        const fullProductData = mapProductRow(productData);
        
        setProduct(fullProductData);
        if (fullProductData.variants && fullProductData.variants.length > 0) {
            setSelectedVariant(fullProductData.variants[0]);
        }

      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

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
  
  const displayPrice = selectedVariant ? (selectedVariant.price ?? 0) : product.price;
  const availableStock = selectedVariant ? (selectedVariant.stock ?? 0) : product.stock;
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
                src={product.image_url || placeholderImage}
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
          </div>
          
          <p className="text-muted-foreground mb-6">{product.description}</p>

          {product.variants && product.variants?.length > 1 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Variant</h3>
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
