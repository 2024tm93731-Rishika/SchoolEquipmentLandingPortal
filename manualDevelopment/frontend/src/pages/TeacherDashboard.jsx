import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import Header from '../components/common/Header';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUser();
    if (userData && userData.role === 'Teacher') {
      setUser(userData);
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  const myRequests = [
    { 
      id: 1,
      equipment: 'Projector Sony 4K',
      status: 'Borrowed',
      requestDate: '2024-10-27',
      dueDate: '2024-11-03',
      color: '#2196F3'
    },
    { 
      id: 2,
      equipment: 'Microphone Set',
      status: 'Approved',
      requestDate: '2024-10-29',
      dueDate: '2024-11-05',
      color: '#4CAF50'
    }
  ];

  const pendingApprovals = [
    {
      id: 1,
      student: 'John Doe',
      equipment: 'Camera Canon',
      requestDate: '2024-10-30',
      duration: '5 days'
    },
    {
      id: 2,
      student: 'Sarah Wilson',
      equipment: 'Laptop HP',
      requestDate: '2024-10-30',
      duration: '3 days'
    }
  ];

  const availableEquipment = [
    { id: 1, name: 'Digital Camera', category: 'Camera', available: 2 },
    { id: 2, name: 'Projector', category: 'Display', available: 3 },
    { id: 3, name: 'Whiteboard', category: 'Classroom', available: 5 },
    { id: 4, name: 'Sound System', category: 'Audio', available: 2 }
  ];

  return (
    <div className="teacher-dashboard">
      <Header />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Teacher Dashboard</h1>
            <p>Welcome back, {user.full_name}!</p>
          </div>
          <button 
            className="btn-primary"
            onClick={() => navigate('/teacher/browse-equipment')}
          >
            Browse Equipment
          </button>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>{myRequests.length}</h3>
              <p>My Requests</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{pendingApprovals.length}</h3>
              <p>Pending Approvals</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>{myRequests.filter(r => r.status === 'Borrowed').length}</h3>
              <p>Currently Borrowed</p>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="section">
          <div className="section-header">
            <h2>Student Requests - Pending Your Approval</h2>
            <button 
              className="btn-link"
              onClick={() => navigate('/teacher/approvals')}
            >
              View All →
            </button>
          </div>
          
          <div className="approvals-list">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((approval) => (
                <div key={approval.id} className="approval-card">
                  <div className="approval-header">
                    <div>
                      <h3>{approval.student}</h3>
                      <p className="equipment-name">{approval.equipment}</p>
                    </div>
                    <span className="status-badge pending">Pending</span>
                  </div>
                  <div className="approval-details">
                    <div className="detail-item">
                      <span className="label">Request Date:</span>
                      <span>{approval.requestDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Duration:</span>
                      <span>{approval.duration}</span>
                    </div>
                  </div>
                  <div className="approval-actions">
                    <button 
                      className="btn-success-small"
                      onClick={() => navigate(`/teacher/approval/${approval.id}`)}
                    >
                      Review
                    </button>
                    <button 
                      className="btn-danger-small"
                      onClick={() => navigate(`/teacher/approval/${approval.id}`)}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>✅ No pending approvals</p>
              </div>
            )}
          </div>
        </div>

        {/* My Requests */}
        <div className="section">
          <div className="section-header">
            <h2>My Equipment Requests</h2>
            <button 
              className="btn-link"
              onClick={() => navigate('/teacher/requests')}
            >
              View All →
            </button>
          </div>
          
          <div className="requests-list">
            {myRequests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <h3>{request.equipment}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: request.color }}
                  >
                    {request.status}
                  </span>
                </div>
                <div className="request-details">
                  <div className="detail-item">
                    <span className="label">Request Date:</span>
                    <span>{request.requestDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Due Date:</span>
                    <span>{request.dueDate}</span>
                  </div>
                </div>
                <button 
                  className="btn-secondary-small"
                  onClick={() => navigate(`/teacher/request/${request.id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Available Equipment */}
        <div className="section">
          <div className="section-header">
            <h2>Available Equipment</h2>
            <button 
              className="btn-link"
              onClick={() => navigate('/teacher/browse-equipment')}
            >
              Browse All →
            </button>
          </div>
          
          <div className="equipment-grid">
            {availableEquipment.map((item) => (
              <div key={item.id} className="equipment-card">
                <div className="equipment-icon">📦</div>
                <h3>{item.name}</h3>
                <p className="equipment-category">{item.category}</p>
                <p className="equipment-availability">
                  {item.available} available
                </p>
                <button 
                  className="btn-primary-small"
                  onClick={() => navigate(`/teacher/equipment/${item.id}`)}
                >
                  Request
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button 
              className="action-button"
              onClick={() => navigate('/teacher/browse-equipment')}
            >
              <span className="action-icon">🔍</span>
              <span>Browse Equipment</span>
            </button>
            <button 
              className="action-button"
              onClick={() => navigate('/teacher/approvals')}
            >
              <span className="action-icon">✅</span>
              <span>Approve Requests</span>
            </button>
            <button 
              className="action-button"
              onClick={() => navigate('/teacher/requests')}
            >
              <span className="action-icon">📋</span>
              <span>My Requests</span>
            </button>
            <button 
              className="action-button"
              onClick={() => navigate('/profile')}
            >
              <span className="action-icon">👤</span>
              <span>My Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
