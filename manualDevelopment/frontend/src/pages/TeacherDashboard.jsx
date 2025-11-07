import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import Header from '../components/common/Header';
import { equipmentAPI } from '../services/api';
import './TeacherDashboard.css';
import RequestEquipmentModal from './RequestEquipmentModal';
import { requestsAPI } from "../services/api";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [loadingEquipment, setLoadingEquipment] = useState(true);
  
  // Modal states
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [myRequests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = getUser();
    if (userData && userData.role === 'Teacher') {
      setUser(userData);
      fetchEquipment();
      fetchRequests();
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  const handleRequest = (item) => {
    setSelectedEquipment(item);
    setShowRequestModal(true);
  };

  // Handle successful request - SHOWS SUCCESS MESSAGE
  const handleRequestSuccess = (message) => {
    setSuccessMessage(message);
    fetchEquipment(); // Refresh to update quantities
    setTimeout(() => setSuccessMessage(''), 5000);
  };

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

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestsAPI.getMyRequests({ limit: 4 });
      if (response.data.success) {
        setRequests(response.data.data || []);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!user) return <div>Loading...</div>;

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

  return (
    <div className="teacher-dashboard">

      {successMessage && (
        <div className="success-toast">
          {successMessage}
        </div>
      )}

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
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>{myRequests.length}</h3>
              <p>My Requests</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>{pendingApprovals.length}</h3>
              <p>Pending Approvals</p>
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
                <p>No pending approvals</p>
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
                  <h3>{request.equipment_name}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: request.color }}
                  >
                    {request.status}
                  </span>
                </div>
                <div className="request-details">
                  <div className="detail-item">
                    <span className="label">Quantity</span>
                    <span>{request.quantity}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Request Date:</span>
                    <span>{formatDate(request.request_date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Due Date:</span>
                    <span>{request.return_date}</span>
                  </div>
                </div>
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
            {equipment.map((item) => (
              <div key={item.id} className="equipment-card">
                <h3>{item.name}</h3>
                <p className="equipment-category">{item.category}</p>
                <p className="equipment-availability">
                  {item.available_quantity} available
                </p>
                <button
                    className={`request-btn ${item.available_quantity === 0 ? 'disabled' : ''}`}
                    onClick={() => handleRequest(item)}
                    disabled={item.available_quantity === 0}>
                  {item.available_quantity > 0 ? 'Request' : 'Unavailable'}
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
              <span>Browse Equipment</span>
            </button>
            <button 
              className="action-button"
              onClick={() => navigate('/teacher/approvals')}
            >
              <span>Approve Requests</span>
            </button>
            <button 
              className="action-button"
              onClick={() => navigate('/teacher/requests')}
            >
              <span>My Requests</span>
            </button>
            <button 
              className="action-button"
              onClick={() => navigate('/profile')}
            >
              <span>My Profile</span>
            </button>
          </div>
        </div>
      </div>
      {/* Request Modal */}
      {showRequestModal && selectedEquipment && (
        <RequestEquipmentModal
          equipment={selectedEquipment}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedEquipment(null);
          }}
          onSuccess={handleRequestSuccess}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;