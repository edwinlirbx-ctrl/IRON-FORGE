import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function OrderConfirmation() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderNumber = urlParams.get('order') || 'N/A';

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <div className="w-20 h-20 bg-primary/10 flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>

        <p className="font-mono text-xs text-primary tracking-widest mb-4">[ORDER CONFIRMED]</p>
        <h1 className="font-inter font-black text-3xl sm:text-4xl tracking-tighter mb-4">
          ORDER RECEIVED
        </h1>
        <p className="text-muted-foreground font-inter mb-2">
          Your order has been placed successfully and is being processed.
        </p>
        <p className="font-mono text-sm text-foreground mb-8">
          Order Number: <span className="text-primary font-bold">{orderNumber}</span>
        </p>

        <div className="border-2 border-border p-6 mb-8 text-left">
          <h3 className="font-inter font-bold text-sm mb-3">WHAT HAPPENS NEXT</h3>
          <div className="space-y-3">
            {[
              'Your order is forwarded to our logistics team',
              'Equipment is quality checked and dispatched within 48 hours',
              'You\'ll receive tracking information via email',
              'Your gear arrives at your door',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="font-mono text-xs text-primary mt-0.5">[{i + 1}]</span>
                <span className="text-sm text-muted-foreground font-inter">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <Link to="/products">
          <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-black tracking-widest text-sm">
            CONTINUE SHOPPING
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}