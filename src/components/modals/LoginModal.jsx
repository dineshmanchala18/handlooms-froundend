import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('customer');
  const [formData, setFormData] = useState({});
  const { login } = useAuth();

  const tabs = [
    { id: 'customer', label: 'Customer', icon: '👤' },
    { id: 'artisan', label: 'Artisan', icon: '🎨' },
    { id: 'admin', label: 'Admin', icon: '⚙️' },
    {
      id: 'consultant',
      label: 'Cultural Consultant',
      icon: '📚',
      description: 'Ensure that the content accurately represents the traditional crafts and heritage.'
    }
  ];

  const activeTabDetails = tabs.find((tab) => tab.id === activeTab);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const identifier = formData.email || formData.artisanId || `${formData.username || 'admin'}@local.app`;

    await login({
      email: identifier.includes('@') ? identifier : null,
      phone: identifier.includes('@') ? null : identifier,
      password: activeTab === 'admin' ? formData.adminCode : formData.password,
      role: activeTab
    });

    onClose();
  };

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Welcome to TribalArtisan</h2>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>
        
        <div className="login-tabs">
          {tabs.map(tab => (
            <div key={tab.id} className={`login-tab ${activeTab === tab.id ? 'active' : ''}`} 
              onClick={() => setActiveTab(tab.id)}>
              {tab.icon} {tab.label}
            </div>
          ))}
        </div>

        {activeTabDetails?.description ? (
          <p className="role-description">{activeTabDetails.description}</p>
        ) : null}

        <form onSubmit={handleSubmit}>
          {activeTab === 'customer' && (
            <>
              <div className="form-group">
                <label>Email</label>
                <input type="email" required placeholder="Enter your email" 
                  onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" required placeholder="Enter your password" 
                  onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </>
          )}

          {activeTab === 'artisan' && (
            <>
              <div className="form-group">
                <label>Artisan ID</label>
                <input type="text" required placeholder="Enter your artisan ID" 
                  onChange={e => setFormData({...formData, artisanId: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" required placeholder="Enter your password" 
                  onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </>
          )}

          {activeTab === 'admin' && (
            <>
              <div className="form-group">
                <label>Admin Username</label>
                <input type="text" required placeholder="Enter admin username" 
                  onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Admin Code</label>
                <input type="password" required placeholder="Enter admin code" 
                  onChange={e => setFormData({...formData, adminCode: e.target.value})} />
              </div>
            </>
          )}

          {activeTab === 'consultant' && (
            <>
              <div className="form-group">
                <label>Email</label>
                <input type="email" required placeholder="Enter your email" 
                  onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" required placeholder="Enter your password" 
                  onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </>
          )}

          <button type="submit" className="login-submit">Login as {activeTabDetails?.label || activeTab}</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
