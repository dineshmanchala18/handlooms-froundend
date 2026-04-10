import { products } from './products';

const productMap = new Map(products.map((product) => [product.id, product]));

const buildLineItem = (productId, quantity) => {
  const product = productMap.get(productId);

  return {
    productId,
    quantity,
    product
  };
};

export const orders = [
  {
    id: 'ORD-2026-1042',
    placedAt: '2026-03-28',
    estimatedDelivery: '2026-04-06',
    status: 'Out for Delivery',
    trackingId: 'TRK-HSK-882104',
    shippingAddress: '12 Lake View Road, Kolkata, West Bengal',
    items: [buildLineItem(1, 1), buildLineItem(2, 1)],
    trackingSteps: [
      { label: 'Order Confirmed', date: '2026-03-28', state: 'completed' },
      { label: 'Packed by Artisan', date: '2026-03-29', state: 'completed' },
      { label: 'Shipped', date: '2026-03-31', state: 'completed' },
      { label: 'Out for Delivery', date: '2026-04-04', state: 'current' },
      { label: 'Delivered', date: 'Expected by 2026-04-06', state: 'upcoming' }
    ]
  },
  {
    id: 'ORD-2026-0987',
    placedAt: '2026-03-20',
    estimatedDelivery: '2026-03-25',
    status: 'Delivered',
    trackingId: 'TRK-HSK-778231',
    shippingAddress: '12 Lake View Road, Kolkata, West Bengal',
    items: [buildLineItem(7, 1)],
    trackingSteps: [
      { label: 'Order Confirmed', date: '2026-03-20', state: 'completed' },
      { label: 'Packed by Artisan', date: '2026-03-21', state: 'completed' },
      { label: 'Shipped', date: '2026-03-22', state: 'completed' },
      { label: 'Out for Delivery', date: '2026-03-24', state: 'completed' },
      { label: 'Delivered', date: '2026-03-25', state: 'completed' }
    ]
  }
];
