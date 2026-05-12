import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Shield, Globe, Zap } from 'lucide-react';

const features = [
  { icon: Globe, label: 'GLOBAL DISPATCH', desc: 'Shipped from optimized logistics hubs worldwide' },
  { icon: Truck, label: '48H PROCESSING', desc: 'Orders processed and dispatched within 48 hours' },
  { icon: Shield, label: 'QUALITY VERIFIED', desc: 'Every item inspected before shipping' },
  { icon: Zap, label: 'DIRECT PRICING', desc: 'Factory-direct pricing, no middlemen markup' },
];

export default function BrandBanner() {
  return (
    <section className="py-24 border-t-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2px] bg-border">
          {features.map((feat, i) => (
            <motion.div
              key={feat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background p-8 group hover:bg-card transition-colors"
            >
              <feat.icon className="w-6 h-6 text-primary mb-6" />
              <h3 className="font-inter font-black text-sm tracking-wider mb-2">{feat.label}</h3>
              <p className="text-sm text-muted-foreground font-inter leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}