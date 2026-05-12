import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://media.base44.com/images/public/6a02d254203d57b45161fb45/6f50053bd_generated_9589f456.png"
          alt="Kettlebell mid-swing in industrial gym"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="max-w-2xl">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-[2px] bg-primary" />
            <span className="font-mono text-xs text-primary tracking-widest">
              [SYS: GLOBAL DISPATCH ACTIVE]
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-inter font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] mb-6"
          >
            FORGED
            <br />
            FOR THE
            <br />
            <span className="text-primary">RELENTLESS</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground font-inter text-base sm:text-lg leading-relaxed mb-10 max-w-lg"
          >
            Premium gym equipment sourced from the world's finest manufacturers. 
            Engineered for performance. Delivered globally.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/products">
              <Button className="h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-black tracking-widest text-sm">
                SHOP EQUIPMENT
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/products?category=kettlebells">
              <Button variant="outline" className="h-14 px-10 border-2 border-border hover:border-primary font-inter font-bold tracking-widest text-xs text-foreground">
                EXPLORE KETTLEBELLS
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex gap-8 mt-16 border-t-2 border-border pt-8"
          >
            {[
              { value: '48H', label: 'PROCESSING' },
              { value: '30+', label: 'COUNTRIES' },
              { value: '100%', label: 'QUALITY TESTED' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-inter font-black text-2xl text-foreground">{stat.value}</p>
                <p className="font-mono text-[10px] text-muted-foreground tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Vertical text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <p className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] writing-mode-vertical"
          style={{ writingMode: 'vertical-rl' }}>
          KINETIC VANGUARD — PERFORMANCE EQUIPMENT — EST. 2024
        </p>
      </div>
    </section>
  );
}