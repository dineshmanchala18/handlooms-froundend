import React, { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { products } from './data/products';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductsGrid from './components/ProductsGrid';
import QuickViewModal from './components/modals/QuickViewModal';
import CartModal from './components/modals/CartModal';
import LoginPage from './pages/LoginPage';
import PaymentPage from './pages/PaymentPage';
import AdminPage from './pages/AdminPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import ArtisanDashboardPage from './pages/ArtisanDashboardPage';

const getMarketplaceProducts = () => {
  const productMap = new Map(products.map((product) => [String(product.id), product]));

  try {
    const artisanProducts = JSON.parse(localStorage.getItem('artisanProducts') || '[]');

    artisanProducts.forEach((product) => {
      productMap.set(String(product.id), product);
    });
  } catch {
    return products;
  }

  return Array.from(productMap.values());
};

const PlaceholderPage = ({ title, description }) => (
  <section className="products-section" style={{ paddingTop: 'calc(var(--nav-height) + 2rem)' }}>
    <h2 className="section-title">{title}</h2>
    <p>{description}</p>
  </section>
);

const HomePage = ({ onQuickView }) => (
  <>
    <Hero />
    <ProductsGrid products={getMarketplaceProducts()} onQuickView={onQuickView} title="Featured Handicrafts" />
  </>
);

const ProductsPage = ({ onQuickView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const marketplaceProducts = getMarketplaceProducts();

  const filteredProducts = marketplaceProducts.filter((product) => {
    const searchableText = [
      product.name,
      product.category,
      product.artisan,
      product.description,
      product.culturalNotes
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(searchTerm.trim().toLowerCase());
  });

  return (
    <section className="products-page" style={{ paddingTop: 'calc(var(--nav-height) + 2rem)' }}>
      <div className="products-search-shell">
        <h2 className="section-title">Our Collection</h2>
        <div className="products-search-bar">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by product name, category, artisan, or craft..."
            aria-label="Search products"
          />
        </div>
      </div>

      <ProductsGrid
        products={filteredProducts}
        onQuickView={onQuickView}
        emptyMessage={`No products matched "${searchTerm}". Try another keyword.`}
      />
    </section>
  );
};

// Main App inner content, behind authentication
function AppShell() {
  const { isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const isAdmin = userType === 'admin';
  const isArtisan = userType === 'artisan';

  return (
    <div className="app">
      <Navbar onCartClick={() => setIsCartOpen(true)} />

      <Routes>
        {isAdmin ? (
          <>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        ) : isArtisan ? (
          <>
            <Route path="/artisan" element={<ArtisanDashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/artisan" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage onQuickView={setSelectedProduct} />} />
            <Route path="/products" element={<ProductsPage onQuickView={setSelectedProduct} />} />
            <Route
              path="/artisans"
              element={
                <PlaceholderPage
                  title="Artisans"
                  description="Meet our artisan community. This section can be expanded with artisan profiles."
                />
              }
            />
            <Route
              path="/about"
              element={
                <PlaceholderPage
                  title="About Us"
                  description="HASTAKARYA connects makers and buyers while preserving traditional craft heritage."
                />
              }
            />
            <Route
              path="/contact"
              element={
                <PlaceholderPage
                  title="Contact"
                  description="Reach us for partnership, support, or custom orders."
                />
              }
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/payment" element={<PaymentPage onBack={() => navigate('/')} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
      
      {!isAdmin && !isArtisan && (
        <>
          <CartModal 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)}
            onCheckout={() => navigate('/payment')}
          />

          <QuickViewModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        </>
      )}
    </div>
  );
}

// Root App component with providers
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
