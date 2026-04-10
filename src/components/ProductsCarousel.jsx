import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductsCarousel = ({ products, onQuickView }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    if (products.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % products.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [products.length]);

  if (!products.length) return null;

  const activeProduct = products[activeIndex];

  const handlePrevious = () => {
    setActiveIndex((current) => (current - 1 + products.length) % products.length);
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % products.length);
  };

  return (
    <section className="carousel-section">
      <div className="carousel-shell">
        <div className="carousel-copy">
          <p className="carousel-kicker">Spotlight Collection</p>
          <h2>Craft stories in motion</h2>
          <p className="carousel-description">
            Browse highlighted handmade pieces from our collection and discover the people and traditions behind them.
          </p>
        </div>

        <div className="carousel-card">
          <button type="button" className="carousel-arrow carousel-arrow-left" onClick={handlePrevious} aria-label="Previous product">
            <
          </button>

          <div className="carousel-media">
            <img src={activeProduct.image} alt={activeProduct.name} className="carousel-image" />
          </div>

          <div className="carousel-details">
            <span className="carousel-category">{activeProduct.category}</span>
            <h3>{activeProduct.name}</h3>
            <p className="carousel-artisan">By {activeProduct.artisan}</p>
            <p className="carousel-text">{activeProduct.description}</p>
            <p className="carousel-notes">{activeProduct.culturalNotes}</p>
            <div className="carousel-footer">
              <span className="carousel-price">${activeProduct.price}</span>
              <div className="carousel-actions">
                <button type="button" className="carousel-btn carousel-secondary-btn" onClick={() => onQuickView(activeProduct)}>
                  Quick View
                </button>
                <button type="button" className="carousel-btn carousel-primary-btn" onClick={() => addToCart(activeProduct)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <button type="button" className="carousel-arrow carousel-arrow-right" onClick={handleNext} aria-label="Next product">
            >
          </button>
        </div>

        <div className="carousel-dots" aria-label="Carousel navigation">
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${product.name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsCarousel;
