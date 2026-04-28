import React, { useState, useEffect, createContext, useContext } from 'react';
import API from '../api/API';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [hasLoadedRemoteCart, setHasLoadedRemoteCart] = useState(false);

  const userId = user?.id ? String(user.id) : user?.email || null;

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartCount(count);
    setCartTotal(total);
  }, [cart]);

  useEffect(() => {
    let isMounted = true;

    const loadRemoteCart = async () => {
      if (!userId) {
        setHasLoadedRemoteCart(true);
        return;
      }

      try {
        const response = await API.get(`/cart/${encodeURIComponent(userId)}`);
        const nextCart = response.data.map((item) => ({
          id: item.productId || item.id,
          cartItemId: item.id,
          name: item.name,
          category: item.category,
          artisan: item.artisan,
          image: item.image,
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1)
        }));

        if (isMounted && nextCart.length > 0) {
          setCart(nextCart);
        }
      } catch {
        // Keep local cart available if backend is temporarily unavailable.
      } finally {
        if (isMounted) {
          setHasLoadedRemoteCart(true);
        }
      }
    };

    loadRemoteCart();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || !hasLoadedRemoteCart) return;

    const syncCart = async () => {
      const payload = cart.map((item) => ({
        productId: Number(item.productId || item.id),
        name: item.name,
        category: item.category,
        artisan: item.artisan,
        image: item.image,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1)
      }));

      try {
        await API.put(`/cart/${encodeURIComponent(userId)}`, payload);
      } catch {
        // Local cart state remains the source of truth until the backend reconnects.
      }
    };

    syncCart();
  }, [cart, hasLoadedRemoteCart, userId]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleWishlist,
      isInWishlist,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};
