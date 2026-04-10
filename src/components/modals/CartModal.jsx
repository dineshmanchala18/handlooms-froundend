import React from 'react';
import { useCart } from '../../context/CartContext';

const CartModal = ({ isOpen, onClose, onCheckout }) => {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Your Shopping Cart</h2>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>

        <>
          <div className="cart-items">
            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">${item.price}</div>
                    <div className="cart-item-quantity">
                      <button className="quantity-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button className="quantity-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <>
              <div className="cart-total">Total: ${cartTotal.toFixed(2)}</div>
              <button
                className="checkout-btn"
                onClick={() => {
                  onClose();
                  if (onCheckout) onCheckout();
                }}
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </>
        
      </div>
    </div>
  );
};

export default CartModal;
