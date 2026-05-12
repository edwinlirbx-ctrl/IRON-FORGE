import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t-2 border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-inter font-black text-sm">KV</span>
              </div>
              <span className="font-inter font-black text-lg tracking-tighter">COOLER</span>
            </div>
            <p className="text-muted-foreground text-sm font-inter leading-relaxed max-w-sm">
              Premium gym equipment engineered for those who refuse to settle. 
              Global logistics. Zero compromises.
            </p>
            <p className="text-xs text-muted-foreground font-mono mt-6">
              © {new Date().getFullYear()} COOLER. ALL RIGHTS RESERVED.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-inter font-black text-xs tracking-widest mb-4 text-foreground">EQUIPMENT</h4>
            <div className="space-y-3">
              {['Kettlebells', 'Barbells', 'Dumbbells', 'Resistance Bands', 'Recovery', 'Nutrition', 'Hydration', 'Bags'].map(cat => (
                <Link
                  key={cat}
                  to={`/products?category=${cat.toLowerCase().replace(' ', '_')}`}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors font-inter"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-inter font-black text-xs tracking-widest mb-4 text-foreground">SUPPORT</h4>
            <div className="space-y-3">
              {['Shipping Info', 'Returns', 'Contact Us', 'FAQ'].map(link => (
                <span key={link} className="block text-sm text-muted-foreground font-inter cursor-default">
                  {link}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}