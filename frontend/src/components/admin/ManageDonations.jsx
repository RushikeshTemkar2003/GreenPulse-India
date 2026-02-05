import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageDonations = () => {
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await api.get('/donations');
      setDonations(response.data.donations);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Manage Donations</h1>

      <div className="card mb-4">
        <div className="card-body text-center">
          <h2 className="text-success">₹{total.toLocaleString()}</h2>
          <p className="text-muted">Total Donations Received</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-custom">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(donation => (
                <tr key={donation.id}>
                  <td>{donation.name}</td>
                  <td>{donation.email}</td>
                  <td>₹{donation.amount}</td>
                  <td><small>{donation.transaction_id}</small></td>
                  <td>{new Date(donation.donation_date).toLocaleString()}</td>
                  <td>
                    {donation.receipt_url && (
                      <a 
                        href={`${(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000')}${donation.receipt_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-success"
                      >
                        View
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageDonations;