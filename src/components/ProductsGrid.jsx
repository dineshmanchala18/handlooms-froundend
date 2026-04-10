import React from 'react';
import ProductCard from './ProductCard';

const ProductsGrid = ({ products, onQuickView, title, emptyMessage = 'No products found.' }) => (
  <section className="products-section">
    {title ? <h2 className="section-title">{title}</h2> : null}
    {products.length > 0 ? (
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    ) : (
      <p className="products-empty-state">{emptyMessage}</p>
    )}
  </section>
);

export default ProductsGrid;
