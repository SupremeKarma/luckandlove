'use client';

import { useSearchParams } from 'next/navigation';
import { ProductList } from '@/components/product-list';
import { PRODUCTS, CATEGORIES } from '@/lib/products';
import { Separator } from '@/components/ui/separator';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const selectedSubcategory = searchParams.get('subcategory');

  const filteredProducts = PRODUCTS.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    // If a subcategory is selected, we need to check if the product's category
    // has that subcategory. Since products only have a main category string,
    // we'll assume that if a subcategory is selected, the main category
    // must also match, and the subcategory is implied by the main category
    // for now. For a more robust solution, products would need a subcategory field.
    return true;
  });

  const pageTitle = selectedSubcategory 
    ? `${selectedSubcategory} in ${selectedCategory}` 
    : selectedCategory 
      ? selectedCategory 
      : 'All Products';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          {pageTitle}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our wide range of products.
        </p>
      </div>
      
      <ProductList products={filteredProducts} />

      {filteredProducts.length === 0 && (
        <div className="text-center text-muted-foreground">
          No products found for this selection.
        </div>
      )}
    </div>
  );
}
