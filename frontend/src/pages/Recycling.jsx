import React, { useState } from 'react';
import api from '../services/api';

const Recycling = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    item_type: 'plastic',
    pickup_date: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState('');

  const validateField = (name, value) => {
    let message = '';

    switch (name) {
      case 'name':
        if (!/^[A-Za-z ]{3,30}$/.test(value)) {
          message = 'Name must contain only letters and be 3-30 characters long.';
        }
        break;
      case 'email':
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
          message = 'Please enter a valid email address.';
        }
        break;
      case 'phone':
        if (!/^[6-9]\d{9}$/.test(value)) {
          message = 'Phone number must be 10 digits and start with 6-9.';
        }
        break;
      case 'address':
        if (value.trim().length < 10) {
          message = 'Address must be at least 10 characters long.';
        }
        break;
      case 'pickup_date':
        if (!value) {
          message = 'Please select a pickup date.';
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submitting
    let isValid = true;
    Object.keys(formData).forEach((field) => {
      if (!validateField(field, formData[field])) isValid = false;
    });

    if (!isValid) return;

    setLoading(true);

    try {
      const response = await api.post('/recycling', formData);
      setSuccess(true);
      setRequestId(response.data.request.request_id);

      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        item_type: 'plastic',
        pickup_date: ''
      });
      setErrors({});
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      alert('Failed to submit request. Please try again.');
      console.error('Recycling request error:', error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="recycling-page py-5">
      <div className="container">
        <div className="row">
          {/* Left Info Section */}
          <div className="col-md-6">
            <h1 className="mb-4">♻️ Recycling Pickup Request</h1>
            <p className="lead">Schedule a free pickup for your recyclable items and contribute to a cleaner environment.</p>
            
            <div className="card my-4">
              <div className="card-body">
                <h5>What We Accept:</h5>
                <ul>
                  <li><strong>Plastic:</strong> Bottles, containers, packaging</li>
                  <li><strong>Paper:</strong> Newspapers, cardboard, office paper</li>
                  <li><strong>E-Waste:</strong> Old electronics, batteries, cables</li>
                  <li><strong>Metal:</strong> Cans, aluminum, steel items</li>
                  <li><strong>Glass:</strong> Bottles, jars, broken glass</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h3 className="card-title">Request Pickup</h3>

                {success && (
                  <div className="alert alert-success">
                    <h5>Request Submitted! ✓</h5>
                    <p>Your Request ID: <strong>{requestId}</strong></p>
                    <p>We'll contact you soon to confirm the pickup.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <div className="text-danger small">{errors.name}</div>}
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <div className="text-danger small">{errors.email}</div>}
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label className="form-label">Phone *</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && <div className="text-danger small">{errors.phone}</div>}
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label className="form-label">Pickup Address *</label>
                    <textarea
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleChange}
                    ></textarea>
                    {errors.address && <div className="text-danger small">{errors.address}</div>}
                  </div>

                  {/* Item Type */}
                  <div className="mb-3">
                    <label className="form-label">Item Type *</label>
                    <select
                      className="form-select"
                      name="item_type"
                      value={formData.item_type}
                      onChange={handleChange}
                    >
                      <option value="plastic">Plastic</option>
                      <option value="paper">Paper</option>
                      <option value="e-waste">E-Waste</option>
                      <option value="metal">Metal</option>
                      <option value="glass">Glass</option>
                    </select>
                  </div>

                  {/* Pickup Date */}
                  <div className="mb-3">
                    <label className="form-label">Preferred Pickup Date *</label>
                    <input
                      type="date"
                      className={`form-control ${errors.pickup_date ? 'is-invalid' : ''}`}
                      name="pickup_date"
                      value={formData.pickup_date}
                      onChange={handleChange}
                      min={today}
                    />
                    {errors.pickup_date && <div className="text-danger small">{errors.pickup_date}</div>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recycling;
