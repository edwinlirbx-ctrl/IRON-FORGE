import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const shippingCost = subtotal > 150 ? 0 : 14.99;
  const total = subtotal + shippingCost;

  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    shipping_address: '', shipping_city: '', shipping_state: '',
    shipping_zip: '', shipping_country: '',
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Block checkout inside iframe (preview mode)
    if (window.self !== window.top) {
      alert('Checkout only works from the published app. Please open the live URL to complete your purchase.');
      return;
    }

    setSubmitting(true);

    try {
      const origin = window.location.origin;
      const response = await base44.functions.invoke('createCheckoutSession', {
        items,
        shippingCost,
        customerInfo: form,
        successUrl: `${origin}/order-confirmation`,
        cancelUrl: `${origin}/checkout`,
      });

      if (response.data?.url) {
        clearCart();
        window.location.href = response.data.url;
      } else {
        toast.error('Could not start checkout. Please try again.');
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Checkout failed. Please try again.');
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground font-inter mb-4">Your kit is empty.</p>
          <Link to="/products">
            <Button variant="outline" className="border-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BROWSE EQUIPMENT
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b-2 border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <Link to="/products" className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-3 h-3" /> BACK TO EQUIPMENT
          </Link>
          <h1 className="font-inter font-black text-3xl tracking-tighter">CHECKOUT</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3 space-y-8">
              {/* Contact */}
              <div>
                <h2 className="font-inter font-black text-sm tracking-widest mb-6 flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary text-primary-foreground flex items-center justify-center text-xs font-mono">1</span>
                  CONTACT
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label className="font-mono text-xs text-muted-foreground">FULL NAME *</Label>
                    <Input required value={form.customer_name} onChange={e => handleChange('customer_name', e.target.value)}
                      className="mt-1 border-2 border-border bg-background h-12 font-inter" />
                  </div>
                  <div>
                    <Label className="font-mono text-xs text-muted-foreground">EMAIL *</Label>
                    <Input required type="email" value={form.customer_email} onChange={e => handleChange('customer_email', e.target.value)}
                      className="mt-1 border-2 border-border bg-background h-12 font-inter" />
                  </div>
                  <div>
                    <Label className="font-mono text-xs text-muted-foreground">PHONE</Label>
                    <Input value={form.customer_phone} onChange={e => handleChange('customer_phone', e.target.value)}
                      className="mt-1 border-2 border-border bg-background h-12 font-inter" />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h2 className="font-inter font-black text-sm tracking-widest mb-6 flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary text-primary-foreground flex items-center justify-center text-xs font-mono">2</span>
                  SHIPPING ADDRESS
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label className="font-mono text-xs text-muted-foreground">ADDRESS *</Label>
                    <Input required value={form.shipping_address} onChange={e => handleChange('shipping_address', e.target.value)}
                      className="mt-1 border-2 border-border bg-background h-12 font-inter" />
                  </div>
                  <div>
                    <Label className="font-mono text-xs text-muted-foreground">CITY *</Label>
                    <Input required value={form.shipping_city} onChange={e => handleChange('shipping_city', e.target.value)}
                      className="mt-1 border-2 border-border bg-background h-12 font-inter" />
                  </div>
                  <div>
                    <Label className="font-mono text-xs text-muted-foreground">STATE / REGION</Label>
                    <Input value={form.shipping_state} onChange={e => handleChange('shipping_state', e.target.value)}
                      className="mt-1 border-2 border-border bg-background h-12 font-inter" />
                  </div>
                  <div>
                    <Label className="font-mono text-xs text-muted-foreground">ZIP / POSTAL CODE *</Label>
                    <Input required value={form.shipping_zip} onChange={e => handleChange('shipping_zip', e.target.value)}
                      className="mt-1 border-2 border-border bg-background h-12 font-inter" />
                  </div>
                  <div>
                    <Label className="font-mono text-xs text-muted-foreground">COUNTRY *</Label>
                    <Input required value={form.shipping_country} onChange={e => handleChange('shipping_country', e.target.value)}
                      className="mt-1 border-2 border-border bg-background h-12 font-inter" />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-black tracking-widest text-sm"
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> PROCESSING...</>
                ) : (
                  <><Lock className="w-4 h-4 mr-2" /> PLACE ORDER — ${total.toFixed(2)}</>
                )}
              </Button>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="border-2 border-border sticky top-24">
                <div className="px-6 py-4 border-b-2 border-border">
                  <h3 className="font-inter font-black text-sm tracking-widest">ORDER SUMMARY</h3>
                </div>
                <div className="divide-y divide-border">
                  {items.map(item => (
                    <div key={item.product_id} className="flex gap-4 px-6 py-4">
                      {item.image && (
                        <img src={item.image} alt="" className="w-14 h-14 object-cover border border-border" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-inter font-semibold text-sm truncate">{item.product_name}</p>
                        <p className="font-mono text-xs text-muted-foreground mt-1">QTY: {item.quantity}</p>
                      </div>
                      <p className="font-inter font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 space-y-3 border-t-2 border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-inter">Subtotal</span>
                    <span className="font-inter font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-inter">Shipping</span>
                    <span className="font-inter font-semibold">
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-inter font-black text-sm">TOTAL</span>
                    <span className="font-inter font-black text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>
                {subtotal < 150 && (
                  <div className="px-6 py-3 bg-card border-t border-border">
                    <p className="font-mono text-[10px] text-primary">
                      ADD ${(150 - subtotal).toFixed(2)} MORE FOR FREE SHIPPING
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}