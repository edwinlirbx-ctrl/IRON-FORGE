import Stripe from 'npm:stripe@14';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response('Webhook Error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const meta = session.metadata;

    const items = JSON.parse(meta.items_json || '[]');
    const shippingCost = parseFloat(meta.shipping_cost || '0');
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal + shippingCost;

    // Save order to database
    try {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.Order.create({
        order_number: meta.order_number,
        status: 'processing',
        customer_name: meta.customer_name,
        customer_email: meta.customer_email,
        customer_phone: meta.customer_phone,
        shipping_address: meta.shipping_address,
        shipping_city: meta.shipping_city,
        shipping_state: meta.shipping_state,
        shipping_zip: meta.shipping_zip,
        shipping_country: meta.shipping_country,
        items: items.map(i => ({
          product_id: i.product_id,
          product_name: i.product_name,
          quantity: i.quantity,
          price: i.price,
          supplier_sku: i.supplier_sku || '',
          supplier_name: i.supplier_name || '',
        })),
        subtotal,
        shipping_cost: shippingCost,
        total,
      });
    } catch (err) {
      console.error('Failed to save order:', err.message);
    }

    // Send notification email
    try {
      const itemsList = items.map(i =>
        `• ${i.product_name} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`
      ).join('\n');

      const emailBody = `
New order received on Iron Forge!

Order #: ${meta.order_number}

Customer Details:
Name: ${meta.customer_name}
Email: ${meta.customer_email}
Phone: ${meta.customer_phone || 'N/A'}

Shipping Address:
${meta.shipping_address}
${meta.shipping_city}, ${meta.shipping_state} ${meta.shipping_zip}
${meta.shipping_country}

Items Ordered:
${itemsList}

Subtotal: $${subtotal.toFixed(2)}
Shipping: ${shippingCost > 0 ? '$' + shippingCost.toFixed(2) : 'FREE'}
TOTAL: $${total.toFixed(2)}

Payment confirmed via Stripe.
      `.trim();

      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: 'edwin.li.family@gmail.com',
        subject: `New Order #${meta.order_number} — $${total.toFixed(2)}`,
        body: emailBody,
      });
    } catch (err) {
      console.error('Failed to send email:', err.message);
    }
  }

  return Response.json({ received: true });
});