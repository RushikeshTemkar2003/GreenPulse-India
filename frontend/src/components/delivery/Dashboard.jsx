import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const [pendingPickups, setPendingPickups] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/delivery-boys/recycling-requests');
      const pending = response.data.requests.filter(r => r.status !== 'completed').length;
      setPendingPickups(pending);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Welcome, {user?.name}! 🚚</h1>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <div className="row justify-content-center g-4">
          {/* Pending Pickups Card */}
          <div className="col-md-5">
            <div className="card text-center shadow-sm border-0 rounded-3 h-100">
              <div className="card-body py-4">
                <i className="bi bi-recycle text-success" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3 fw-bold">Pending Pickups</h5>
                <h3 className="text-success mb-3">{pendingPickups}</h3>
                <p className="text-muted">Number of recycling pickups yet to complete</p>
              </div>
            </div>
          </div>

          {/* My Pickups Card */}
          <div className="col-md-5">
            <div className="card text-center shadow-sm border-0 rounded-3 h-100">
              <div className="card-body py-4">
                <i className="bi bi-list-check text-success" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3 fw-bold">My Pickups</h5>
                <p className="text-muted mb-4">Manage your assigned recycling pickups</p>
                <Link to="/delivery/my-tasks" className="btn btn-success px-4">
                  View My Pickups
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
