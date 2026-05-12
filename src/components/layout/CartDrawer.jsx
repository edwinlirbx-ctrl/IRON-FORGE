import React from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, subtotal, isOpen, setIsOpen } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l-2 border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-border">
              <div>
                <h2 className="font-inter font-black text-lg tracking-tight">YOUR KIT</h2>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  [{items.length} ITEMS]
                </p>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground font-inter text-sm">YOUR KIT IS EMPTY</p>
                  <p className="text-xs text-muted-foreground mt-2">Add equipment to begin.</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.product_id} className="flex gap-4 border-2 border-border p-3">
                    {item.image && (
                      <img src={item.image} alt={item.product_name} className="w-20 h-20 object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-inter font-bold text-sm truncate">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="w-7 h-7 border border-border flex items-center justify-center hover:border-primary transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-7 h-7 border border-border flex items-center justify-center hover:border-primary transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t-2 border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-inter font-semibold text-sm text-muted-foreground">SUBTOTAL</span>
                  <span className="font-inter font-black text-xl">${subtotal.toFixed(2)}</span>
                </div>
                <Link to="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-black tracking-widest text-sm">
                    PROCEED TO CHECKOUT
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}