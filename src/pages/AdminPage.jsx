import React, { useEffect, useState } from 'react';
import API from '../api/API';
import { products } from '../data/products';
import '../styles/AdminPage.css';

const sampleUsers = [
  { id: 'U-1001', name: 'Anita Verma', role: 'Customer', status: 'Active' },
  { id: 'U-1002', name: 'Raghu Gond', role: 'Artisan', status: 'Pending Approval' },
  { id: 'U-1003', name: 'Maya Singh', role: 'Consultant', status: 'Active' },
  { id: 'U-1004', name: 'Tara Sen', role: 'Artisan', status: 'Suspended' }
];

const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  } catch {
    return [];
  }
};

const formatUser = (user) => ({
  id: user.id || user.email || user.phone || crypto.randomUUID(),
  name: user.name || user.email || user.phone || 'Unnamed User',
  email: user.email || '-',
  phone: user.phone || '-',
  role: user.role || 'Customer',
  status: user.status || 'Active'
});

const orders = [
  { id: 'ORD-9081', customer: 'Anita Verma', payment: 'Paid', amount: '$89.99', issue: 'None' },
  { id: 'ORD-9082', customer: 'Vikram Das', payment: 'Failed', amount: '$249.99', issue: 'Retry Needed' },
  { id: 'ORD-9083', customer: 'Kiran Rao', payment: 'Refunded', amount: '$129.99', issue: 'Refund Completed' }
];

const feedbackItems = [
  { type: 'Review', summary: 'Possible fake rating spike on one product', action: 'Remove / Investigate' },
  { type: 'Comment', summary: 'Inappropriate language in customer comment', action: 'Moderate Content' },
  { type: 'Authenticity', summary: 'Consultant verification needed for tribal motif claim', action: 'Assign Consultant' }
];

const promotions = [
  { campaign: 'Holi Craft Week', discount: '20%', channel: 'Homepage + Email', status: 'Scheduled' },
  { campaign: 'Top Artisan Spotlight', discount: 'None', channel: 'Homepage Banner', status: 'Active' }
];

const issues = [
  { ticket: 'ISS-301', type: 'Customer Complaint', owner: 'Support Team', status: 'Open' },
  { ticket: 'ISS-302', type: 'Artisan Dispute', owner: 'Admin', status: 'In Progress' },
  { ticket: 'ISS-303', type: 'Delivery Issue', owner: 'Logistics', status: 'Resolved' },
  { ticket: 'ISS-304', type: 'Refund Request', owner: 'Finance', status: 'Pending' }
];

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [usersStatus, setUsersStatus] = useState('Loading users...');

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const response = await API.get('/user');
        const nextUsers = Array.isArray(response.data)
          ? response.data.map(formatUser)
          : [];

        if (isMounted) {
          setUsers(nextUsers);
          setUsersStatus(nextUsers.length ? 'Loaded from MySQL' : 'No MySQL users found');
        }
      } catch {
        const localUsers = getLocalUsers().map(formatUser);

        if (isMounted) {
          setUsers(localUsers.length ? localUsers : sampleUsers);
          setUsersStatus(localUsers.length ? 'Loaded from browser storage' : 'Showing sample users');
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalArtisans = users.filter((user) => user.role?.toLowerCase() === 'artisan').length;
  const topProducts = products
    .slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
    .map((product) => product.name)
    .join(', ');
  const revenue = orders
    .filter((order) => order.payment === 'Paid')
    .reduce((sum, order) => sum + Number(order.amount.replace('$', '')), 0)
    .toFixed(2);

  const stats = [
    { label: 'Total Users', value: String(users.length) },
    { label: 'Total Artisans', value: String(totalArtisans) },
    { label: 'Total Products', value: String(products.length) },
    { label: 'Total Orders', value: String(orders.length) },
    { label: 'Revenue Generated', value: `$${revenue}` },
    { label: 'Top-selling Products', value: topProducts }
  ];

  return (
    <section className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Platform operations, moderation, transactions, promotions, and reporting in one view.</p>
      </div>

      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <p className="admin-stat-label">{stat.label}</p>
            <p className="admin-stat-value">{stat.value}</p>
          </article>
        ))}
      </div>

      <div className="admin-management-grid">
        <article className="admin-panel-card">
          <div className="admin-panel-heading">
            <h2>User Management</h2>
            <span>{usersStatus}</span>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>
                    <td>{user.status}</td>
                    <td className="admin-actions">
                      <button type="button">Approve</button>
                      <button type="button">Reject</button>
                      <button type="button">Block/Suspend</button>
                      <button type="button">Reset Password</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel-card">
          <h2>Product Management</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Artisan</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="admin-product-image"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.artisan}</td>
                    <td className="admin-actions">
                      <button type="button">Approve Listing</button>
                      <button type="button">Edit</button>
                      <button type="button">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel-card">
          <h2>Orders and Transactions</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Payment Status</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.payment}</td>
                    <td>{order.amount}</td>
                    <td className="admin-actions">
                      <button type="button">View History</button>
                      <button type="button">Refund</button>
                      <button type="button">Handle Failure</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel-card">
          <h2>Content Moderation</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Detail</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {feedbackItems.map((item) => (
                  <tr key={item.summary}>
                    <td>{item.type}</td>
                    <td>{item.summary}</td>
                    <td className="admin-actions">
                      <button type="button">{item.action}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel-card">
          <h2>Promotion and Marketing</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Discount</th>
                  <th>Channel</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo) => (
                  <tr key={promo.campaign}>
                    <td>{promo.campaign}</td>
                    <td>{promo.discount}</td>
                    <td>{promo.channel}</td>
                    <td>{promo.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-actions admin-inline-actions">
            <button type="button">Launch Festival Promo</button>
            <button type="button">Feature Artisan</button>
            <button type="button">Send Email Notification</button>
            <button type="button">Manage Homepage Banner</button>
          </div>
        </article>

        <article className="admin-panel-card">
          <h2>Issue Resolution</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Issue Type</th>
                  <th>Owner</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.ticket}>
                    <td>{issue.ticket}</td>
                    <td>{issue.type}</td>
                    <td>{issue.owner}</td>
                    <td>{issue.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AdminPage;
