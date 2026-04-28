import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/API';
import { useAuth } from '../context/AuthContext';
import { orders } from '../data/orders';
import '../styles/MyOrdersPage.css';

const formatDate = (value) => new Date(value).toLocaleDateString();
const getStatusClassName = (status) => status.toLowerCase().replace(/\s+/g, '-');
const buildTrackingSteps = (order) => {
  const placedAt = order.placedAt || new Date().toISOString();
  const estimatedDelivery = order.estimatedDelivery || placedAt;
  const isCancelled = order.status === 'Cancelled';
  const isDelivered = order.status === 'Delivered';

  return [
    { label: 'Order Confirmed', date: formatDate(placedAt), state: isCancelled ? 'upcoming' : 'completed' },
    { label: 'Packed by Artisan', date: 'Processing', state: isDelivered ? 'completed' : 'current' },
    { label: 'Shipped', date: 'Pending', state: isDelivered ? 'completed' : 'upcoming' },
    { label: 'Out for Delivery', date: 'Pending', state: isDelivered ? 'completed' : 'upcoming' },
    { label: 'Delivered', date: isDelivered ? formatDate(estimatedDelivery) : `Expected by ${formatDate(estimatedDelivery)}`, state: isDelivered ? 'completed' : 'upcoming' }
  ];
};

const formatOrder = (order) => ({
  id: order.id ? `ORD-${order.id}` : order.trackingId,
  databaseId: order.id,
  placedAt: order.placedAt || order.createdAt,
  estimatedDelivery: order.estimatedDelivery || order.createdAt,
  status: order.status || 'Confirmed',
  trackingId: order.trackingId || `TRK-HSK-${order.id}`,
  shippingAddress: [order.shippingAddress, order.city, order.state, order.postalCode].filter(Boolean).join(', '),
  items: (order.items || []).map((item) => ({
    productId: item.productId || item.id,
    quantity: item.quantity,
    product: {
      id: item.productId || item.id,
      image: item.image,
      name: item.name,
      category: item.category,
      artisan: item.artisan,
      description: item.description || '',
      price: item.price
    }
  })),
  trackingSteps: buildTrackingSteps(order)
});

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customerOrders, setCustomerOrders] = useState(orders);
  const [ordersNotice, setOrdersNotice] = useState('');
  const userId = user?.id ? String(user.id) : user?.email || null;

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      if (!userId) return;

      try {
        const response = await API.get(`/orders/user/${encodeURIComponent(userId)}`);
        if (isMounted) {
          setCustomerOrders(response.data.map(formatOrder));
          setOrdersNotice('');
        }
      } catch {
        if (isMounted) {
          setOrdersNotice('Showing demo orders until the backend is available.');
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleCancelOrder = async (orderId) => {
    const order = customerOrders.find((item) => item.id === orderId);

    if (order?.databaseId) {
      try {
        await API.patch(`/orders/${order.databaseId}/status`, { status: 'Cancelled' });
      } catch {
        setOrdersNotice('Order cancelled on screen. Backend sync failed.');
      }
    }

    setCustomerOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: 'Cancelled',
              trackingSteps: order.trackingSteps.map((step) => (
                step.state === 'current'
                  ? { ...step, state: 'upcoming' }
                  : step
              ))
            }
          : order
      )
    );
  };

  return (
    <section className="orders-page">
      <div className="orders-shell">
        <div className="orders-header">
          <div>
            <p className="orders-kicker">Customer Dashboard</p>
            <h1>My Orders</h1>
            <p className="orders-subtitle">
              Track delivery progress and review product information for every purchase.
            </p>
            {ordersNotice ? <p className="orders-subtitle">{ordersNotice}</p> : null}
          </div>
          <button type="button" className="orders-back-btn" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>

        <div className="orders-list">
          {customerOrders.map((order) => {
            const canCancelOrder = order.status !== 'Delivered' && order.status !== 'Cancelled';

            return (
            <article className="order-card" key={order.id}>
              <div className="order-topbar">
                <div>
                  <p className="order-label">Order ID</p>
                  <h2>{order.id}</h2>
                </div>
                <div className="order-status-actions">
                  <span className={`order-status-badge status-${getStatusClassName(order.status)}`}>
                    {order.status}
                  </span>
                  {canCancelOrder ? (
                    <button
                      type="button"
                      className="order-cancel-btn"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel Order
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="order-meta-grid">
                <div className="order-meta-item">
                  <span className="order-meta-label">Placed On</span>
                  <strong>{formatDate(order.placedAt)}</strong>
                </div>
                <div className="order-meta-item">
                  <span className="order-meta-label">Estimated Delivery</span>
                  <strong>{formatDate(order.estimatedDelivery)}</strong>
                </div>
                <div className="order-meta-item">
                  <span className="order-meta-label">Tracking ID</span>
                  <strong>{order.trackingId}</strong>
                </div>
                <div className="order-meta-item">
                  <span className="order-meta-label">Ship To</span>
                  <strong>{order.shippingAddress}</strong>
                </div>
              </div>

              <div className="order-content-grid">
                <div className="order-products">
                  <h3>Product Information</h3>
                  {order.items.map((item) => (
                    <div className="order-product-card" key={`${order.id}-${item.productId}`}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="order-product-image"
                      />
                      <div className="order-product-info">
                        <p className="order-product-category">{item.product.category}</p>
                        <h4>{item.product.name}</h4>
                        <p className="order-product-artisan">By {item.product.artisan}</p>
                        <p className="order-product-description">{item.product.description}</p>
                        <div className="order-product-meta">
                          <span>Qty: {item.quantity}</span>
                          <span>${item.product.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-tracking">
                  <h3>Delivery Tracking</h3>
                  <div className="tracking-timeline">
                    {order.trackingSteps.map((step) => (
                      <div className={`tracking-step ${step.state}`} key={`${order.id}-${step.label}`}>
                        <div className="tracking-dot" aria-hidden="true" />
                        <div className="tracking-copy">
                          <strong>{step.label}</strong>
                          <span>{step.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
          })}
        </div>
      </div>
    </section>
  );
};

export default MyOrdersPage;
