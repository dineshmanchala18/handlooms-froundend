import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthPages.css';

const ForgotPasswordPage = () => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    requestPasswordReset(email);
    setSubmitted(true);
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Forgot Password</h1>
        <p>Enter your email to request a password reset link.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          {submitted ? (
            <p className="auth-success">
              If this email exists, a reset request has been recorded.
            </p>
          ) : null}

          <button type="submit" className="auth-primary-btn">Send Reset Link</button>
        </form>

        <div className="auth-footer-links">
          <Link to="/login">Back to Login</Link>
          <Link to="/create-account">Create Account</Link>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
