import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MyTasks = () => {
  const [recyclingRequests, setRecyclingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecyclingRequests();
  }, []);

  const fetchRecyclingRequests = async () => {
    try {
      const response = await api.get('/delivery-boys/recycling-requests');
      setRecyclingRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePickup = async (requestId) => {
    try {
      await api.put(`/delivery-boys/recycling-requests/${requestId}/complete`);
      alert('Pickup completed successfully!');
      fetchRecyclingRequests();
    } catch (error) {
      alert('Failed to complete pickup');
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">My Recycling Pickups</h1>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <div className="row g-4">
          {recyclingRequests.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info text-center">
                No recycling pickups assigned yet.
              </div>
            </div>
          ) : (
            recyclingRequests.map((request) => (
              <div key={request.id} className="col-md-6">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5>Pickup Request #{request.request_id}</h5>
                      <span
                        className={`badge ${
                          request.status === 'completed'
                            ? 'bg-success'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {request.status.toUpperCase()}
                      </span>
                    </div>
                    <p><strong>Name:</strong> {request.name}</p>
                    <p><strong>Phone:</strong> {request.phone}</p>
                    <p><strong>Item Type:</strong> {request.item_type?.toUpperCase()}</p>
                    <p><strong>Address:</strong> {request.address}</p>
                    <p className="mb-3">
                      <strong>Pickup Date:</strong>{' '}
                      {new Date(request.pickup_date).toLocaleDateString()}
                    </p>

                    {request.status === 'assigned' && (
                      <button
                        className="btn btn-success w-100"
                        onClick={() => handleCompletePickup(request.id)}
                      >
                        Mark as Completed
                      </button>
                    )}

                    {request.status === 'completed' && (
                      <div className="alert alert-success mb-0 text-center">
                        ✓ Pickup Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
