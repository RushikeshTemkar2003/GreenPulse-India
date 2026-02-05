import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageUsers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [activeTab, setActiveTab] = useState('volunteers');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    const id = setInterval(fetchUsers, 15000);
    return () => clearInterval(id);
  }, []);

  const fetchUsers = async () => {
    try {
      const [volunteersRes, deliveryBoysRes] = await Promise.all([
        api.get('/admin/volunteers'),
        api.get('/admin/delivery-boys')
      ]);
      
      setVolunteers(volunteersRes.data.volunteers);
      setDeliveryBoys(deliveryBoysRes.data.deliveryBoys);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Manage Users</h1>
        <button className="btn btn-outline-success btn-sm" onClick={fetchUsers}>Refresh</button>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'volunteers' ? 'active' : ''}`}
            onClick={() => setActiveTab('volunteers')}
          >
            Volunteers ({volunteers.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'delivery' ? 'active' : ''}`}
            onClick={() => setActiveTab('delivery')}
          >
            Delivery Boys ({deliveryBoys.length})
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <>
          {activeTab === 'volunteers' && (
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Events Participated</th>
                   
                    <th>Total Donated</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map(volunteer => (
                    <tr key={volunteer.volunteer_id}>
                      <td>{volunteer.name}</td>
                      <td>{volunteer.events_participated}</td>
                     
                      <td>₹{volunteer.total_donated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Vehicle Type</th>
                  
                    <th>Completed Pickups</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryBoys.map(boy => (
                    <tr key={boy.delivery_boy_id}>
                      <td>{boy.name}</td>
                      <td>{boy.vehicle_type || 'N/A'}</td>
                      
                      <td>{boy.completed_pickups}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageUsers;