import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ProfilePage.css';

const formatRoleLabel = (role) => {
  if (!role) return 'Member';
  if (role === 'consultant') return 'Cultural Consultant';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const getDashboardPath = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'artisan') return '/artisan';
  if (role === 'consultant') return '/consultant';
  return '/';
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, userType, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photo: ''
  });

  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const profileRecord = registeredUsers.find((item) => item.email === user?.email);

  const memberSince = profileRecord?.createdAt
    ? new Date(profileRecord.createdAt).toLocaleDateString()
    : 'Recently joined';

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      photo: user?.photo || profileRecord?.photo || ''
    });
  }, [profileRecord?.photo, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, photo: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProfile({
      name: formData.name.trim(),
      email: formData.email.trim(),
      photo: formData.photo
    });
    setIsEditing(false);
    setSaveMessage('Profile updated successfully.');
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      photo: user?.photo || profileRecord?.photo || ''
    });
    setIsEditing(false);
  };

  return (
    <section className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-shell">
            <div className="profile-avatar" aria-hidden="true">
              {formData.photo ? (
                <img src={formData.photo} alt="Profile" className="profile-avatar-image" />
              ) : (
                <svg viewBox="0 0 24 24" className="profile-avatar-icon">
                  <path
                    d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.87 0-7 2.24-7 5v1h14v-1c0-2.76-3.13-5-7-5Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </div>

            {isEditing ? (
              <label className="profile-photo-btn">
                Edit Photo
                <input type="file" accept="image/*" onChange={handlePhotoChange} />
              </label>
            ) : null}
          </div>

          <div>
            <p className="profile-kicker">User Profile</p>
            <h1>{formData.name || 'HASTAKARYA Member'}</h1>
            <p className="profile-subtitle">Manage your account details and view your membership information.</p>
          </div>
        </div>

        {saveMessage ? <p className="profile-save-message">{saveMessage}</p> : null}

        {isEditing ? (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-grid">
              <label className="profile-field">
                <span className="profile-label">Full Name</span>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="profile-field">
                <span className="profile-label">Email</span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <div className="profile-field">
                <span className="profile-label">Role</span>
                <strong>{formatRoleLabel(userType)}</strong>
              </div>
              <div className="profile-field">
                <span className="profile-label">Member Since</span>
                <strong>{memberSince}</strong>
              </div>
            </div>

            <div className="profile-actions">
              <button type="submit" className="profile-save-btn">Save Changes</button>
              <button type="button" className="profile-cancel-btn" onClick={handleCancel}>Cancel</button>
              <button
                type="button"
                className="profile-back-btn"
                onClick={() => navigate(getDashboardPath(userType))}
              >
                Back to Dashboard
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="profile-grid">
              <div className="profile-field">
                <span className="profile-label">Full Name</span>
                <strong>{user?.name || 'Not available'}</strong>
              </div>
              <div className="profile-field">
                <span className="profile-label">Email</span>
                <strong>{user?.email || 'Not available'}</strong>
              </div>
              <div className="profile-field">
                <span className="profile-label">Role</span>
                <strong>{formatRoleLabel(userType)}</strong>
              </div>
              <div className="profile-field">
                <span className="profile-label">Member Since</span>
                <strong>{memberSince}</strong>
              </div>
            </div>

            <div className="profile-actions">
              <button type="button" className="profile-save-btn" onClick={() => {
                setSaveMessage('');
                setIsEditing(true);
              }}>
                Edit Profile
              </button>
              {userType !== 'admin' && userType !== 'consultant' ? (
                <button
                  type="button"
                  className="profile-back-btn"
                  onClick={() => navigate('/orders')}
                >
                  My Orders
                </button>
              ) : null}
              <button
                type="button"
                className="profile-back-btn"
                onClick={() => navigate(getDashboardPath(userType))}
              >
                Back to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProfilePage;
