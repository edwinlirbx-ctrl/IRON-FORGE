import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandBanner from '@/components/home/BrandBanner';
import CategoryGrid from '@/components/home/CategoryGrid';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <BrandBanner />
      <FeaturedProducts />
      <CategoryGrid />
    </div>
  );
}