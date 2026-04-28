import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.css';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9\s-]{7,15}$/;

const LoginPage = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    artisanId: '',
    adminUsername: '',
    adminCode: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('customer');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      id: 'admin',
      name: 'Admin',
      description: 'Manage platform content, monitor transactions, and resolve issues.'
    },
    {
      id: 'artisan',
      name: 'Artisan',
      description: 'Create and update product listings, manage orders, and communicate with customers.'
    },
    {
      id: 'customer',
      name: 'Customer',
      description: 'Explore and purchase handcrafted items, provide reviews, and participate in promotions.'
    },
    {
      id: 'consultant',
      name: 'Cultural Consultant',
      description: 'Ensure that the content accurately represents the traditional crafts and heritage.'
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (selectedRole === 'admin') {
      try {
        await login({
          email: `${formData.adminUsername || 'admin'}@local.app`,
          password: formData.password,
          role: selectedRole
      });
    } catch (requestError) {
      setErrorMessage(
        !requestError.response
          ? 'Backend is not running. Start Spring Boot on port 8081 to read users from MySQL.'
          : requestError.response?.data || requestError.message || 'Login failed. Please check your admin credentials.'
      );
    }
      return;
    }

    const trimmedIdentifier = formData.emailOrPhone.trim();

    if ((selectedRole === 'customer' || selectedRole === 'consultant') && trimmedIdentifier) {
      const isEmailFormat = trimmedIdentifier.includes('@');
      const isValidIdentifier = isEmailFormat
        ? emailPattern.test(trimmedIdentifier)
        : phonePattern.test(trimmedIdentifier);

      if (!isValidIdentifier) {
        setErrorMessage(
          isEmailFormat
            ? 'Enter a valid email address.'
            : 'Enter a valid phone number.'
        );
        return;
      }
    }

    const identifier =
      selectedRole === 'artisan'
        ? formData.artisanId
        : trimmedIdentifier;

    const isEmail = identifier.includes('@');

    try {
      await login({
        email: isEmail ? identifier : null,
        phone: isEmail ? null : identifier,
        password: formData.password,
        role: selectedRole
      });
    } catch (requestError) {
      setErrorMessage(
        !requestError.response
          ? 'Backend is not running. Start Spring Boot on port 8081 to read users from MySQL.'
          : requestError.response?.data || requestError.message || 'Login failed. Please check your credentials or create an account first.'
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Section - Form */}
        <div className="login-left">
          {/* Logo */}
          <div className="login-logo">
            <img src="/hastakarya-logo.svg" alt="HASTAKARYA" className="logo-image" />
          </div>

          {/* Heading */}
          <h1 className="login-heading">HASTAKARYA</h1>
          <p className="login-subheading">MADE BY HAND</p>

          {/* Role Selection Tabs */}
          <div className="role-tabs">
            {roles.map(role => (
              <button
                key={role.id}
                type="button"
                className={`role-tab ${selectedRole === role.id ? 'active' : ''}`}
                onClick={() => setSelectedRole(role.id)}
                title={role.description}
              >
                {role.name}
              </button>
            ))}
          </div>

          {/* Role Description */}
          <p className="role-description">
            {roles.find(r => r.id === selectedRole)?.description}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Customer & Consultant - Email or Phone */}
            {(selectedRole === 'customer' || selectedRole === 'consultant') && (
              <div className="form-group">
                <label htmlFor="emailOrPhone" className="form-label">Email Address or Phone Number</label>
                <input
                  type="text"
                  id="emailOrPhone"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  placeholder="your@email.com or +91 98765 43210"
                  className="form-input"
                  inputMode={formData.emailOrPhone.includes('@') ? 'email' : 'tel'}
                  required
                />
              </div>
            )}

            {/* Artisan - Artisan ID */}
            {selectedRole === 'artisan' && (
              <div className="form-group">
                <label htmlFor="artisanId" className="form-label">Artisan ID</label>
                <input
                  type="text"
                  id="artisanId"
                  name="artisanId"
                  value={formData.artisanId}
                  onChange={handleChange}
                  placeholder="Enter your artisan ID"
                  className="form-input"
                  required
                />
              </div>
            )}

            {/* Admin - Username */}
            {selectedRole === 'admin' && (
              <div className="form-group">
                <label htmlFor="adminUsername" className="form-label">Admin Username</label>
                <input
                  type="text"
                  id="adminUsername"
                  name="adminUsername"
                  value={formData.adminUsername}
                  onChange={handleChange}
                  placeholder="Enter admin username"
                  className="form-input"
                  required
                />
              </div>
            )}

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="forgot-link" onClick={() => navigate('/forgot-password')}>
                Forgot password?
              </button>
            </div>

            {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

            {/* Login Button */}
            <button type="submit" className="btn-login">
              Login as {roles.find(r => r.id === selectedRole)?.name}
            </button>

            {/* Create Account Button */}
            <button type="button" className="btn-signup" onClick={() => navigate('/create-account')}>
              Create account
            </button>
          </form>

          {/* Privacy Text */}
          <p className="privacy-text">
            By sign up you agree to our terms and that you have read our data policy
          </p>
        </div>

        {/* Right Section - Image */}
        <div className="login-right">
          <div className="image-container">
            <img
              src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80"
              alt="Tribal Artisan"
              className="login-image"
            />
            <div className="image-overlay"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
