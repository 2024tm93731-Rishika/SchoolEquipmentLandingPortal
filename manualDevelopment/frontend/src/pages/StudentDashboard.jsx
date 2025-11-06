import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import Header from '../components/common/Header';
import './StudentDashboard.css';
import { equipmentAPI } from '../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [loadingEquipment, setLoadingEquipment] = useState(true);

  useEffect(() => {
    const userData = getUser();
    if (userData && userData.role === 'Student') {
      setUser(userData);
      fetchEquipment();
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Fetch only 4 equipment items for dashboard preview
    const fetchEquipment = async () => {
      try {
        setLoadingEquipment(true);
        const response = await equipmentAPI.getAll({ limit: 4 });
        if (response.data.success) {
          setEquipment(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch equipment:', err);
      } finally {
        setLoadingEquipment(false);
      }
    };
  

  if (!user) return <div>Loading...</div>;

  const myRequests = [
    { 
      id: 1,
      equipment: 'Laptop Dell XPS 15',
      status: 'Approved',
      requestDate: '2024-10-28',
      dueDate: '2024-11-04',
      color: '#4CAF50'
    },
    { 
      id: 2,
      equipment: 'Projector Epson',
      status: 'Pending',
      requestDate: '2024-10-29',
      dueDate: '2024-11-05',
      color: '#FF9800'
    },
    { 
      id: 3,
      equipment: 'Camera Canon EOS',
      status: 'Borrowed',
      requestDate: '2024-10-25',
      dueDate: '2024-11-01',
      color: '#2196F3'
    }
  ];

  return (
    <div className="student-dashboard">
      <Header />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Student Dashboard</h1>
            <p>Welcome back, {user.full_name}!</p>
          </div>
          <button 
            className="btn-primary"
            onClick={() => navigate('/student/browse-equipment')}
          >
            Browse Equipment
          </button>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>{myRequests.length}</h3>
              <p>My Requests</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>{myRequests.filter(r => r.status === 'Approved').length}</h3>
              <p>Approved</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>{myRequests.filter(r => r.status === 'Borrowed').length}</h3>
              <p>Currently Borrowed</p>
            </div>
          </div>
        </div>

        {/* My Requests */}
        <div className="section">
          <div className="section-header">
            <h2>My Requests</h2>
            <button 
              className="btn-link"
              onClick={() => navigate('/student/requests')}
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
                  onClick={() => navigate(`/student/request/${request.id}`)}
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
              onClick={() => navigate('/student/browse-equipment')}
            >
              Browse All →
            </button>
          </div>
          
          <div className="equipment-grid">
            {equipment.map((item) => (
              <div key={item.id} className="equipment-card">
                <div className="equipment-icon"></div>
                <h3>{item.name}</h3>
                <p className="equipment-category">{item.category}</p>
                <p className="equipment-availability">
                  {item.available_quantity} available
                </p>
                <button 
                  className="btn-primary-small"
                  onClick={() => navigate(`/student/equipment/${item.id}`)}
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
              onClick={() => navigate('/student/browse-equipment')}
            >
              <span className="action-icon"></span>
              <span>Browse Equipment</span>
            </button>
            <button 
              className="action-button"
              onClick={() => navigate('/student/requests')}
            >
              <span className="action-icon"></span>
              <span>My Requests</span>
            </button>
            <button 
              className="action-button"
              onClick={() => navigate('/profile')}
            >
              <span className="action-icon"></span>
              <span>My Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;