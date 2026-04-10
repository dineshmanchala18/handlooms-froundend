import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthPages.css';

const roleDescriptions = {
  consultant: 'Cultural Consultant: Ensure that the content accurately represents the traditional crafts and heritage.'
};

const CreateAccountPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'customer',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register(
        {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        },
        formData.role
      );

      setSuccess('Account created successfully.');
      setTimeout(() => navigate('/'), 900);
    } catch (requestError) {
      setError(
        requestError.response?.data ||
        requestError.message ||
        'Could not create account. Please try again.'
      );
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Register as customer, artisan, or cultural consultant.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            required
          />

          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange}>
            <option value="customer">Customer</option>
            <option value="artisan">Artisan</option>
            <option value="consultant">Cultural Consultant</option>
          </select>
          {roleDescriptions[formData.role] ? (
            <p className="auth-role-description">{roleDescriptions[formData.role]}</p>
          ) : null}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength={6}
            required
          />

          {error ? <p className="auth-error">{error}</p> : null}
          {success ? <p className="auth-success">{success}</p> : null}

          <button type="submit" className="auth-primary-btn">Create Account</button>
        </form>

        <div className="auth-footer-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </section>
  );
};

export default CreateAccountPage;
