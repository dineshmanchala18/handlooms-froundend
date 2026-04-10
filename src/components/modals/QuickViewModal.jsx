import React from 'react';
import { useCart } from '../../context/CartContext';

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content details-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <img src={product.image} alt={product.name} />
        <div className="details-info">
          <h2>{product.name}</h2>
          <p className="artisan">By {product.artisan}</p>
          <p className="category">{product.category}</p>
          
          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="cultural-notes">
            <h3>Cultural Significance</h3>
            <p>{product.culturalNotes}</p>
          </div>
          
          <div className="price-section">
            <span className="price">RS{product.price}</span>
            <button className="add-to-cart-btn" onClick={() => { addToCart(product); onClose(); }}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
