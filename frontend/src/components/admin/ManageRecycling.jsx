import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageRecycling = () => {
  const [requests, setRequests] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
    fetchDeliveryBoys();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/recycling');
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryBoys = async () => {
    try {
      const response = await api.get('/admin/delivery-boys');
      setDeliveryBoys(response.data.deliveryBoys);
    } catch (error) {
      console.error('Error fetching delivery boys:', error);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    
    try {
      await api.put(`/recycling/${selectedRequest.id}/assign`, {
        deliveryBoyId: selectedDeliveryBoy
      });
      alert('Request assigned successfully!');
      setShowAssignModal(false);
      setSelectedRequest(null);
      setSelectedDeliveryBoy('');
      fetchRequests();
    } catch (error) {
      alert('Failed to assign request');
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Manage Recycling Requests</h1>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-custom">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Item Type</th>
                <th>Pickup Date</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <tr key={request.id}>
                  <td><small>{request.request_id}</small></td>
                  <td>{request.name}</td>
                  <td>{request.phone}</td>
                  <td><span className="badge bg-info">{request.item_type}</span></td>
                  <td>{new Date(request.pickup_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${
                      request.status === 'pending' ? 'bg-warning' :
                      request.status === 'assigned' ? 'bg-primary' :
                      request.status === 'completed' ? 'bg-success' : 'bg-secondary'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td>{request.assigned_to_name || 'Unassigned'}</td>
                  <td>
                    {request.status === 'pending' && (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowAssignModal(true);
                        }}
                      >
                        Assign
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign Pickup Request</h5>
                <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)}></button>
              </div>
              <form onSubmit={handleAssign}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Request Details</label>
                    <p><strong>Name:</strong> {selectedRequest?.name}</p>
                    <p><strong>Address:</strong> {selectedRequest?.address}</p>
                    <p><strong>Item:</strong> {selectedRequest?.item_type}</p>
                    <p><strong>Date:</strong> {new Date(selectedRequest?.pickup_date).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Select Delivery Boy *</label>
                    <select 
                      className="form-select"
                      value={selectedDeliveryBoy}
                      onChange={(e) => setSelectedDeliveryBoy(e.target.value)}
                      required
                    >
                      <option value="">Choose a delivery boy...</option>
                      {deliveryBoys.map(boy => (
                        <option key={boy.delivery_boy_id} value={boy.delivery_boy_id}>
                          {boy.name} - {boy.vehicle_type || 'No vehicle'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">Assign Request</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRecycling;