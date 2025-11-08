import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import Header from '../components/common/Header';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUser();
    if (userData && userData.role === 'Admin') {
      setUser(userData);
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  const stats = [
    { label: 'Total Users', value: '182', icon: '', color: '#4CAF50' },
    { label: 'Total Equipment', value: '45', icon: '', color: '#2196F3' },
    { label: 'Active Requests', value: '12', icon: '', color: '#FF9800' },
    { label: 'Pending Approvals', value: '5', icon: '', color: '#f44336' }
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'Add, edit, or remove users',
      icon: '',
      path: '/admin/users',
      color: '#4CAF50'
    },
    {
      title: 'Manage Equipment',
      description: 'Add, edit, or remove equipment',
      icon: '',
      path: '/admin/equipment',
      color: '#2196F3'
    },
    {
      title: 'View All Requests',
      description: 'Review borrowing requests',
      icon: '',
      path: '/admin/all-requests',
      color: '#FF9800'
    },
    {
      title: 'Reports & Analytics',
      description: 'View system reports',
      icon: '',
      path: '/admin/reports',
      color: '#9C27B0'
    }
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'Borrowed Laptop #23', time: '2 hours ago' },
    { user: 'Jane Smith', action: 'Returned Projector #5', time: '4 hours ago' },
    { user: 'Mike Johnson', action: 'Requested Camera #12', time: '5 hours ago' }
  ];

  return (
    <div className="admin-dashboard">
      <Header />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user.full_name}!</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/profile')}>
            View Profile
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="stat-icon" style={{ backgroundColor: stat.color + '20' }}>
                <span>{stat.icon}</span>
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div 
                key={index} 
                className="action-card"
                onClick={() => navigate(action.path)}
              >
                <div className="action-icon" style={{ backgroundColor: action.color }}>
                  {action.icon}
                </div>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <button className="action-btn">Go →</button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-avatar">
                  {activity.user.charAt(0)}
                </div>
                <div className="activity-details">
                  <p className="activity-user">{activity.user}</p>
                  <p className="activity-action">{activity.action}</p>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/admin/activity')}
          >
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;