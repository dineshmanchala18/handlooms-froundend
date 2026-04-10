import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  return (
    <div className="product-card" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        {isHovered && (
          <div className="product-overlay">
            <button className="quick-view-btn" onClick={() => onQuickView(product)}>Quick View</button>
          </div>
        )}
        {product.stock < 5 && <span className="stock-badge">Only {product.stock} left</span>}
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-artisan">By {product.artisan}</p>
        
        <div className="product-rating">
          {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
          <span className="rating-number">({product.rating})</span>
        </div>

        <div className="product-price">${product.price}</div>

        <div className="product-actions">
          <button className="add-to-cart-btn" onClick={() => addToCart(product)} disabled={product.stock === 0}>
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`} 
            onClick={() => toggleWishlist(product)}>
            {isInWishlist(product.id) ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
