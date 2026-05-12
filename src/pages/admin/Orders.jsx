import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, Truck, Eye, Copy, Search } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped_to_supplier: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  supplier_confirmed: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  in_transit: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  refunded: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 100),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order updated');
    },
  });

  const filtered = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = !search ||
      order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const copySupplierInfo = (order) => {
    const info = order.items?.map(item =>
      `Product: ${item.product_name}\nSKU: ${item.supplier_sku || 'N/A'}\nQty: ${item.quantity}\nSupplier: ${item.supplier_name || 'N/A'}`
    ).join('\n\n');

    const full = `ORDER: ${order.order_number}\n\nSHIP TO:\n${order.customer_name}\n${order.shipping_address}\n${order.shipping_city}, ${order.shipping_state} ${order.shipping_zip}\n${order.shipping_country}\n\nITEMS:\n${info}`;

    navigator.clipboard.writeText(full);
    toast.success('Supplier info copied to clipboard');
  };

  return (
    <div className="min-h-screen">
      <div className="border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-primary" />
            <span className="font-mono text-xs text-primary tracking-widest">[ADMIN]</span>
          </div>
          <h1 className="font-inter font-black text-3xl tracking-tighter">ORDER MANAGEMENT</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Manage orders and forward to dropship suppliers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 border-2 border-border bg-background h-10 font-inter text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 border-2 border-border bg-background font-inter text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL STATUSES</SelectItem>
              <SelectItem value="pending">PENDING</SelectItem>
              <SelectItem value="processing">PROCESSING</SelectItem>
              <SelectItem value="shipped_to_supplier">SENT TO SUPPLIER</SelectItem>
              <SelectItem value="supplier_confirmed">SUPPLIER CONFIRMED</SelectItem>
              <SelectItem value="in_transit">IN TRANSIT</SelectItem>
              <SelectItem value="delivered">DELIVERED</SelectItem>
              <SelectItem value="cancelled">CANCELLED</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[2px] bg-border mb-8">
          {[
            { label: 'PENDING', count: orders.filter(o => o.status === 'pending').length },
            { label: 'PROCESSING', count: orders.filter(o => o.status === 'processing').length },
            { label: 'IN TRANSIT', count: orders.filter(o => o.status === 'in_transit').length },
            { label: 'TOTAL REVENUE', count: `$${orders.reduce((s, o) => s + (o.total || 0), 0).toFixed(0)}` },
          ].map(s => (
            <div key={s.label} className="bg-background p-5">
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider">{s.label}</p>
              <p className="font-inter font-black text-2xl mt-1">{s.count}</p>
            </div>
          ))}
        </div>

        {/* Orders list */}
        <div className="border-2 border-border">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-card border-b border-border font-mono text-[10px] text-muted-foreground tracking-wider">
            <div className="col-span-2">ORDER</div>
            <div className="col-span-3">CUSTOMER</div>
            <div className="col-span-2">STATUS</div>
            <div className="col-span-1">TOTAL</div>
            <div className="col-span-2">DATE</div>
            <div className="col-span-2">ACTIONS</div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground font-mono text-sm">Loading orders...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground font-mono text-sm">No orders found.</div>
          ) : (
            filtered.map(order => (
              <div key={order.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 border-b border-border hover:bg-card/50 transition-colors items-center">
                <div className="md:col-span-2">
                  <p className="font-mono text-sm text-primary font-bold">{order.order_number}</p>
                </div>
                <div className="md:col-span-3">
                  <p className="font-inter font-semibold text-sm truncate">{order.customer_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{order.customer_email}</p>
                </div>
                <div className="md:col-span-2">
                  <Badge className={`${STATUS_COLORS[order.status] || ''} border font-mono text-[10px]`}>
                    {order.status?.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="md:col-span-1">
                  <p className="font-inter font-bold text-sm">${order.total?.toFixed(2)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-mono text-xs text-muted-foreground">
                    {order.created_date ? format(new Date(order.created_date), 'MMM d, yyyy') : ''}
                  </p>
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <Button size="sm" variant="outline" className="border-2 h-8 text-xs"
                    onClick={() => setSelectedOrder(order)}>
                    <Eye className="w-3 h-3 mr-1" /> View
                  </Button>
                  <Button size="sm" variant="outline" className="border-2 h-8 text-xs"
                    onClick={() => copySupplierInfo(order)}>
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order detail modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl bg-background border-2 border-border">
          <DialogHeader>
            <DialogTitle className="font-inter font-black tracking-tighter">
              ORDER {selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <OrderDetailView
              order={selectedOrder}
              onUpdate={(data) => {
                updateMutation.mutate({ id: selectedOrder.id, data });
                setSelectedOrder({ ...selectedOrder, ...data });
              }}
              onCopy={() => copySupplierInfo(selectedOrder)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderDetailView({ order, onUpdate, onCopy }) {
  const [tracking, setTracking] = useState(order.tracking_number || '');
  const [notes, setNotes] = useState(order.notes || '');
  const [supplierOrderId, setSupplierOrderId] = useState(order.supplier_order_id || '');

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Status update */}
      <div>
        <Label className="font-mono text-xs text-muted-foreground">STATUS</Label>
        <Select value={order.status} onValueChange={v => onUpdate({ status: v })}>
          <SelectTrigger className="mt-1 border-2 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['pending', 'processing', 'shipped_to_supplier', 'supplier_confirmed', 'in_transit', 'delivered', 'cancelled', 'refunded'].map(s => (
              <SelectItem key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Customer info */}
      <div className="border-2 border-border p-4">
        <h4 className="font-mono text-xs text-muted-foreground tracking-wider mb-3">SHIP TO</h4>
        <p className="font-inter text-sm font-semibold">{order.customer_name}</p>
        <p className="text-sm text-muted-foreground">{order.shipping_address}</p>
        <p className="text-sm text-muted-foreground">
          {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
        </p>
        <p className="text-sm text-muted-foreground">{order.shipping_country}</p>
        <p className="text-sm text-muted-foreground mt-2">{order.customer_email} | {order.customer_phone}</p>
      </div>

      {/* Items */}
      <div className="border-2 border-border">
        <div className="px-4 py-3 border-b border-border">
          <h4 className="font-mono text-xs text-muted-foreground tracking-wider">ITEMS</h4>
        </div>
        {order.items?.map((item, i) => (
          <div key={i} className="px-4 py-3 border-b border-border last:border-b-0">
            <div className="flex justify-between">
              <div>
                <p className="font-inter font-semibold text-sm">{item.product_name}</p>
                <p className="font-mono text-[10px] text-muted-foreground mt-1">
                  SKU: {item.supplier_sku || 'N/A'} | SUPPLIER: {item.supplier_name || 'N/A'} | QTY: {item.quantity}
                </p>
              </div>
              <p className="font-inter font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
        <div className="px-4 py-3 bg-card flex justify-between">
          <span className="font-inter font-bold text-sm">TOTAL</span>
          <span className="font-inter font-black text-lg">${order.total?.toFixed(2)}</span>
        </div>
      </div>

      {/* Supplier fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="font-mono text-xs text-muted-foreground">SUPPLIER ORDER ID</Label>
          <Input value={supplierOrderId} onChange={e => setSupplierOrderId(e.target.value)}
            className="mt-1 border-2 border-border bg-background" placeholder="e.g. SUP-12345" />
        </div>
        <div>
          <Label className="font-mono text-xs text-muted-foreground">TRACKING NUMBER</Label>
          <Input value={tracking} onChange={e => setTracking(e.target.value)}
            className="mt-1 border-2 border-border bg-background" placeholder="e.g. 1Z999AA10123456784" />
        </div>
      </div>
      <div>
        <Label className="font-mono text-xs text-muted-foreground">INTERNAL NOTES</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)}
          className="mt-1 border-2 border-border bg-background" rows={3} />
      </div>

      <div className="flex gap-3">
        <Button onClick={() => onUpdate({ tracking_number: tracking, supplier_order_id: supplierOrderId, notes })}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-bold text-xs tracking-wider">
          <Truck className="w-4 h-4 mr-2" /> SAVE CHANGES
        </Button>
        <Button variant="outline" className="border-2 font-inter font-bold text-xs tracking-wider" onClick={onCopy}>
          <Copy className="w-4 h-4 mr-2" /> COPY FOR SUPPLIER
        </Button>
      </div>
    </div>
  );
}