import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Minus, Plus, ArrowLeft, Truck, Globe, Shield, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const products = await base44.entities.Product.filter({ id });
      return products[0] || null;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/products" className="text-primary mt-4 inline-block">← Back to Equipment</Link>
      </div>
    );
  }

  const images = product.images || [];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">HOME</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:text-primary transition-colors">EQUIPMENT</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{product.name?.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-card border-2 border-border overflow-hidden mb-4"
            >
              {images[selectedImage] ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary">
                  <span className="font-mono text-sm text-muted-foreground">[NO IMAGE]</span>
                </div>
              )}
            </motion.div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-[2px]">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square bg-card border-2 overflow-hidden transition-colors ${
                      selectedImage === i ? 'border-primary' : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details - Sticky */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-8">
            {/* Product info */}
            <div>
              <p className="font-mono text-xs text-primary tracking-widest mb-2">
                [REF: {product.ref_code || product.category?.toUpperCase()}]
              </p>
              <h1 className="font-inter font-black text-3xl sm:text-4xl tracking-tighter mb-4">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-inter font-black text-3xl">${product.price?.toFixed(2)}</span>
                {product.compare_at_price && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.compare_at_price.toFixed(2)}
                  </span>
                )}
              </div>
              {product.description && (
                <p className="text-muted-foreground font-inter leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Specs */}
            <div className="border-2 border-border">
              <div className="px-5 py-3 border-b border-border">
                <span className="font-mono text-xs text-muted-foreground tracking-widest">SPECIFICATIONS</span>
              </div>
              <div className="divide-y divide-border">
                {product.weight && (
                  <div className="flex justify-between px-5 py-3">
                    <span className="font-mono text-xs text-muted-foreground">WEIGHT</span>
                    <span className="font-inter font-semibold text-sm">{product.weight}</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex justify-between px-5 py-3">
                    <span className="font-mono text-xs text-muted-foreground">MATERIAL</span>
                    <span className="font-inter font-semibold text-sm">{product.material}</span>
                  </div>
                )}
                {product.grip_type && (
                  <div className="flex justify-between px-5 py-3">
                    <span className="font-mono text-xs text-muted-foreground">GRIP</span>
                    <span className="font-inter font-semibold text-sm">{product.grip_type}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between px-5 py-3">
                    <span className="font-mono text-xs text-muted-foreground">DIMENSIONS</span>
                    <span className="font-inter font-semibold text-sm">{product.dimensions}</span>
                  </div>
                )}
                {product.shipping_origin && (
                  <div className="flex justify-between px-5 py-3">
                    <span className="font-mono text-xs text-muted-foreground">SHIPS FROM</span>
                    <span className="font-inter font-semibold text-sm">{product.shipping_origin}</span>
                  </div>
                )}
                {product.estimated_shipping_days && (
                  <div className="flex justify-between px-5 py-3">
                    <span className="font-mono text-xs text-muted-foreground">EST. DELIVERY</span>
                    <span className="font-inter font-semibold text-sm">{product.estimated_shipping_days} business days</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-muted-foreground tracking-wider">QTY</span>
                <div className="flex items-center border-2 border-border">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center font-mono text-sm border-x-2 border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <Button
                onClick={() => addItem(product, quantity)}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-black tracking-widest text-sm"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                ADD TO KIT — ${(product.price * quantity).toFixed(2)}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-[2px] bg-border">
              {[
                { icon: Truck, label: 'FAST DISPATCH' },
                { icon: Globe, label: 'GLOBAL SHIPPING' },
                { icon: Shield, label: 'QUALITY VERIFIED' },
              ].map(badge => (
                <div key={badge.label} className="bg-background p-4 text-center">
                  <badge.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="font-mono text-[9px] text-muted-foreground tracking-wider">{badge.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}