import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import { CartProvider } from '@/context/CartContext';

export default function AppLayout() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <CartDrawer />
        <main className="pt-16">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}