import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { value: 'all', label: 'ALL EQUIPMENT' },
  { value: 'kettlebells', label: 'KETTLEBELLS' },
  { value: 'barbells', label: 'BARBELLS' },
  { value: 'dumbbells', label: 'DUMBBELLS' },
  { value: 'resistance_bands', label: 'RESISTANCE BANDS' },
  { value: 'accessories', label: 'ACCESSORIES' },
  { value: 'apparel', label: 'APPAREL' },
  { value: 'recovery', label: 'RECOVERY' },
];

export default function Products() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';

  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('name');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.filter({ in_stock: true }),
    initialData: [],
  });

  const filtered = useMemo(() => {
    let result = category === 'all'
      ? products
      : products.filter(p => p.category === category);

    return [...result].sort((a, b) => {
      if (sortBy === 'price_low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price_high') return (b.price || 0) - (a.price || 0);
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [products, category, sortBy]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-primary" />
            <span className="font-mono text-xs text-primary tracking-widest">[CATALOG]</span>
          </div>
          <h1 className="font-inter font-black text-4xl sm:text-5xl tracking-tighter">
            EQUIPMENT
          </h1>
          <p className="text-muted-foreground font-inter mt-3 max-w-lg">
            Performance-grade gear. Globally sourced. Shipped direct.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1.5 text-xs font-inter font-semibold tracking-wider transition-colors border ${
                    category === cat.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:border-primary hover:text-foreground'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 border-2 border-border bg-background font-inter text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">SORT: NAME</SelectItem>
                <SelectItem value="price_low">SORT: PRICE ↑</SelectItem>
                <SelectItem value="price_high">SORT: PRICE ↓</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <p className="font-mono text-xs text-muted-foreground">
          [{filtered.length} ITEMS] — READY FOR GLOBAL DISPATCH
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-border">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-background p-6">
                <Skeleton className="aspect-square w-full mb-4" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground font-inter">No equipment found in this category.</p>
            <Button
              variant="outline"
              className="mt-4 border-2"
              onClick={() => setCategory('all')}
            >
              VIEW ALL EQUIPMENT
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-border">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="block bg-background group relative"
                >
                  <div className="aspect-square overflow-hidden bg-card relative">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <span className="font-mono text-xs text-muted-foreground">[NO IMAGE]</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 bg-primary flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
                      </div>
                    </div>
                    {/* Spec overlay on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-4 font-mono text-[10px] text-foreground/80">
                        {product.weight && <span>WT: {product.weight}</span>}
                        {product.material && <span>MAT: {product.material}</span>}
                        {product.grip_type && <span>GRIP: {product.grip_type}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 border-t-2 border-border">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-1">
                          [{product.ref_code || product.category?.toUpperCase()}]
                        </p>
                        <h3 className="font-inter font-bold text-sm tracking-tight">
                          {product.name}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-inter font-black text-lg">${product.price?.toFixed(2)}</p>
                        {product.compare_at_price && (
                          <p className="text-xs text-muted-foreground line-through">
                            ${product.compare_at_price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}