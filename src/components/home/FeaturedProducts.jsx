import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => base44.entities.Product.filter({ featured: true }, '-sort_order', 6),
    initialData: [],
  });

  return (
    <section className="py-24 border-t-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-primary" />
              <span className="font-mono text-xs text-primary tracking-widest">[FEATURED]</span>
            </div>
            <h2 className="font-inter font-black text-3xl sm:text-4xl tracking-tighter">
              SELECT EQUIPMENT
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-2 text-sm font-inter font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            VIEW ALL
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-border">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-background p-6">
                <Skeleton className="aspect-square w-full mb-4" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            ))
          ) : (
            products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="block bg-background group relative overflow-hidden"
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden bg-card">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <span className="font-mono text-xs">[NO IMAGE]</span>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 bg-primary flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 border-t-2 border-border">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-1">
                          [{product.ref_code || product.category?.toUpperCase()}]
                        </p>
                        <h3 className="font-inter font-bold text-sm tracking-tight">
                          {product.name}
                        </h3>
                      </div>
                      <div className="text-right">
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
            ))
          )}
        </div>

        {/* Mobile link */}
        <Link
          to="/products"
          className="sm:hidden flex items-center justify-center gap-2 mt-8 text-sm font-inter font-semibold text-primary"
        >
          VIEW ALL EQUIPMENT
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}