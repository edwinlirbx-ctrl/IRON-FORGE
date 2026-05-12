import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { name: 'KETTLEBELLS', slug: 'kettlebells', desc: 'Cast iron precision' },
  { name: 'BARBELLS', slug: 'barbells', desc: 'Olympic grade steel' },
  { name: 'DUMBBELLS', slug: 'dumbbells', desc: 'Hex rubber coated' },
  { name: 'RESISTANCE', slug: 'resistance_bands', desc: 'Progressive tension' },
  { name: 'ACCESSORIES', slug: 'accessories', desc: 'Essential gear' },
  { name: 'RECOVERY', slug: 'recovery', desc: 'Optimize restoration' },
  { name: 'NUTRITION', slug: 'nutrition', desc: 'Fuel your performance' },
  { name: 'HYDRATION', slug: 'hydration', desc: 'Stay fueled, stay sharp' },
  { name: 'APPAREL', slug: 'apparel', desc: 'Train in performance gear' },
  { name: 'BAGS', slug: 'bags', desc: 'Carry everything you need' },
];

export default function CategoryGrid() {
  return (
    <section className="py-24 border-t-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-[2px] bg-primary" />
          <span className="font-mono text-xs text-primary tracking-widest">[CATEGORIES]</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-border">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="block bg-background p-8 group hover:bg-card transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-2">
                      [{String(i + 1).padStart(2, '0')}]
                    </p>
                    <h3 className="font-inter font-black text-xl tracking-tight group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-inter mt-2">{cat.desc}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}