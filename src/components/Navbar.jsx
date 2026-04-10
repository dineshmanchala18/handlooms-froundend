import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onCartClick }) => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { isAuthenticated, logout, userType, user } = useAuth();
  const isAdmin = userType === 'admin';
  const isArtisan = userType === 'artisan';

  const navLinks = isAdmin
    ? [{ to: '/admin', label: 'Admin Dashboard', icon: 'Panel', end: true }]
    : isArtisan
      ? [{ to: '/artisan', label: 'Artisan Dashboard', icon: 'Craft', end: true }]
      : [
          { to: '/', label: 'Home', end: true },
          { to: '/products', label: 'Products', icon: 'Shop' },
          { to: '/artisans', label: 'Artisans', icon: 'Team' },
          { to: '/about', label: 'About Us', icon: 'Info' },
          { to: '/contact', label: 'Contact', icon: 'Call' }
        ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <img src="/hastakarya-logo.svg" alt="HASTAKARYA Logo" className="logo-image" />
          <h1 className="logo-text">HASTAKARYA</h1>
        </div>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span> {link.label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <button className="icon-button user-btn">
                {user?.photo ? (
                  <img src={user.photo} alt="Profile" className="user-photo" />
                ) : (
                  <svg
                    className="user-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.87 0-7 2.24-7 5v1h14v-1c0-2.76-3.13-5-7-5Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </button>
              <div className="user-dropdown">
                <button onClick={() => navigate('/profile')} className="dropdown-item">Profile</button>
                {isArtisan ? (
                  <button onClick={() => navigate('/artisan')} className="dropdown-item">Artisan Dashboard</button>
                ) : !isAdmin ? (
                  <button onClick={() => navigate('/orders')} className="dropdown-item">My Orders</button>
                ) : null}
                <button onClick={logout} className="dropdown-item">Logout</button>
              </div>
            </div>
          ) : (
            <button className="icon-button login-btn" onClick={() => navigate('/')}>
              <span>Login</span>
            </button>
          )}

          {!isAdmin && !isArtisan && (
            <button className="icon-button cart-btn" onClick={onCartClick}>
              <span>Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
