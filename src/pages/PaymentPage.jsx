import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/PaymentPage.css';

const PaymentPage = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { clearCart, cartTotal, cart } = useCart();
  const { user } = useAuth();
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });

  useEffect(() => {
    setCustomerInfo((current) => ({
      ...current,
      fullName: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const paymentMethods = [
    { id: 'card', label: 'Credit Card', icon: 'CC' },
    { id: 'paypal', label: 'PayPal', icon: 'PP' },
    { id: 'upi', label: 'UPI', icon: 'UPI' },
    { id: 'bank', label: 'Bank Transfer', icon: 'BNK' }
  ];

  const steps = [
    { id: 1, label: 'Customer Info' },
    { id: 2, label: 'Order Review' },
    { id: 3, label: 'Payment' }
  ];

  const isCustomerInfoComplete = Object.values(customerInfo).every((value) => value.trim() !== '');

  const handleCustomerInfoChange = (event) => {
    const { name, value } = event.target;
    setCustomerInfo((current) => ({
      ...current,
      [name]: value
    }));
  };

  const goToNextStep = () => {
    if (currentStep === 1 && !isCustomerInfoComplete) {
      alert('Please complete all customer information fields before continuing.');
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, 3));
  };

  const goToPreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const handlePayment = (event) => {
    event.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    alert('Payment successful! Thank you for your purchase (demo).');
    clearCart();
    onBack();
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card checkout-card-full">
        <div className="checkout-left">
          <button type="button" className="checkout-back-btn" onClick={onBack}>
            Back to Shop
          </button>

          <h1 className="checkout-heading">Secure Checkout</h1>
          <p className="checkout-subheading">HASTAKARYA | MADE BY HAND</p>

          <div className="checkout-summary">
            <span>Total Amount</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>

          <div className="checkout-steps">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`checkout-step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'complete' : ''}`}
              >
                <span className="checkout-step-number">{step.id}</span>
                <span className="checkout-step-label">{step.label}</span>
              </div>
            ))}
          </div>

          {currentStep === 1 && (
            <section className="checkout-customer-card">
              <div className="checkout-section-head">
                <div>
                  <p className="checkout-section-kicker">Step 1</p>
                  <h3>Customer Information</h3>
                </div>
                <span className="checkout-item-count">{cart.length} item(s)</span>
              </div>

              <div className="checkout-form-row">
                <div className="checkout-form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={customerInfo.fullName}
                    onChange={handleCustomerInfoChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="checkout-form-row">
                <div className="checkout-form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={handleCustomerInfoChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    value={customerInfo.postalCode}
                    onChange={handleCustomerInfoChange}
                    placeholder="Postal code"
                    required
                  />
                </div>
              </div>

              <div className="checkout-form-group">
                <label htmlFor="address">Delivery Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={customerInfo.address}
                  onChange={handleCustomerInfoChange}
                  placeholder="House number, street, landmark"
                  required
                />
              </div>

              <div className="checkout-form-row">
                <div className="checkout-form-group">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={customerInfo.city}
                    onChange={handleCustomerInfoChange}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="state">State</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={customerInfo.state}
                    onChange={handleCustomerInfoChange}
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              <div className="checkout-nav-actions">
                <button type="button" className="checkout-next-btn" onClick={goToNextStep}>
                  Continue to Review
                </button>
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section className="checkout-customer-card">
              <div className="checkout-section-head">
                <div>
                  <p className="checkout-section-kicker">Step 2</p>
                  <h3>Products in This Order</h3>
                </div>
              </div>

              <div className="checkout-order-items">
                {cart.map((item) => (
                  <article className="checkout-order-item" key={item.id}>
                    <img src={item.image} alt={item.name} className="checkout-order-item-image" />
                    <div className="checkout-order-item-info">
                      <p className="checkout-order-item-category">{item.category}</p>
                      <h4>{item.name}</h4>
                      <p className="checkout-order-item-artisan">By {item.artisan}</p>
                      <div className="checkout-order-item-meta">
                        <span>Qty: {item.quantity}</span>
                        <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="checkout-nav-actions">
                <button type="button" className="checkout-secondary-btn" onClick={goToPreviousStep}>
                  Back
                </button>
                <button type="button" className="checkout-next-btn" onClick={goToNextStep}>
                  Continue to Payment
                </button>
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <>
              <h3 className="checkout-method-title">Select Payment Method</h3>
              <div className="checkout-methods">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    className={`checkout-method ${paymentMethod === method.id ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <span className="checkout-payment-icon">{method.icon}</span>
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handlePayment} className="checkout-form">
                {paymentMethod === 'card' && (
                  <>
                    <div className="checkout-form-group">
                      <label htmlFor="cardNumber">Card Number</label>
                      <input id="cardNumber" type="text" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="checkout-form-group">
                      <label htmlFor="cardName">Cardholder Name</label>
                      <input id="cardName" type="text" placeholder="John Doe" required />
                    </div>
                    <div className="checkout-form-row">
                      <div className="checkout-form-group">
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <input id="expiryDate" type="text" placeholder="MM/YY" required />
                      </div>
                      <div className="checkout-form-group">
                        <label htmlFor="cvv">CVV</label>
                        <input id="cvv" type="text" placeholder="123" required />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="checkout-form-group">
                    <label htmlFor="paypalEmail">PayPal Email</label>
                    <input id="paypalEmail" type="email" placeholder="email@paypal.com" required />
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="checkout-form-group">
                    <label htmlFor="upiId">UPI ID</label>
                    <input id="upiId" type="text" placeholder="username@upi" required />
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <>
                    <div className="checkout-form-group">
                      <label htmlFor="accountNumber">Account Number</label>
                      <input id="accountNumber" type="text" placeholder="Enter account number" required />
                    </div>
                    <div className="checkout-form-group">
                      <label htmlFor="ifscCode">IFSC Code</label>
                      <input id="ifscCode" type="text" placeholder="IFSC code" required />
                    </div>
                  </>
                )}

                <div className="checkout-nav-actions">
                  <button type="button" className="checkout-secondary-btn" onClick={goToPreviousStep}>
                    Back
                  </button>
                  <button type="submit" className="checkout-pay-btn">
                    Pay Now
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
