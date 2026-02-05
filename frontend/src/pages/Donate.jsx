import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Donate = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'donor',
    amount: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState('');
  const [donationData, setDonationData] = useState(null);

  // Regex patterns
  const patterns = {
    name: /^[A-Za-z\s]{3,}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
    phone: /^[6-9][0-9]{9}$/,
    amount: /^[1-9][0-9]*$/
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!patterns.name.test(value)) return 'Name must have at least 3 letters and only alphabets allowed.';
        break;
      case 'email':
        if (!patterns.email.test(value)) return 'Enter a valid email address.';
        break;
      case 'phone':
        if (!patterns.phone.test(value)) return 'Phone number must start with 6–9 and be 10 digits.';
        break;
      case 'amount':
        if (!patterns.amount.test(value)) return 'Enter a valid positive number.';
        break;
      default:
        return '';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate live
    setErrors({
      ...errors,
      [name]: validateField(name, value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check all fields
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const errorMsg = validateField(field, formData[field]);
      if (errorMsg) newErrors[field] = errorMsg;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // Stop if any error

    setLoading(true);
    try {
      const response = await api.post('/donations', formData);
      const donation = response.data.donation;
      setSuccess(true);
      setDonationData(donation);

      let receipt = donation?.receipt_url || response.data.receipt_url;
      if (receipt && !receipt.startsWith('/') && !receipt.startsWith('http')) {
        receipt = '/' + receipt;
      }
      if (receipt) setReceiptUrl(receipt);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Donation failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getFullReceiptURL = () => {
    if (!receiptUrl) return '';
    if (receiptUrl.startsWith('http')) return receiptUrl;
    const baseURL =
      import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseURL}${receiptUrl.startsWith('/') ? receiptUrl : `/${receiptUrl}`}`;
  };

  const handleDownloadReceipt = () => {
    const url = getFullReceiptURL();
    if (!url) return alert('Receipt URL not available.');
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${donationData?.receipt_id || Date.now()}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewDonation = () => {
    setSuccess(false);
    setReceiptUrl('');
    setDonationData(null);
    setFormData({ ...formData, amount: '' });
    setErrors({});
  };

  const presetAmounts = [100, 500, 1000, 5000];

  return (
    <div className="donate-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <h1 className="text-center mb-4">💚 Support Our Cause</h1>
                <p className="text-center text-muted mb-5">
                  Your donation helps us plant more trees, organize cleanup drives, and create a greener India.
                </p>

                {success ? (
                  <div className="success-container text-center">
                    <div className="alert alert-success shadow-sm border-0">
                      <h2 className="alert-heading mb-3 text-success">🎉 Thank You for Your Donation!</h2>
                      <p className="lead">
                        You donated <strong>₹{donationData?.amount || formData.amount}</strong>.  
                        A receipt has been sent to your email.
                      </p>
                      {receiptUrl && (
                        <button
                          onClick={handleDownloadReceipt}
                          className="btn btn-success me-2 mt-3"
                        >
                          <i className="bi bi-download"></i> Download Receipt
                        </button>
                      )}
                      <button onClick={handleNewDonation} className="btn btn-primary mt-3">
                        Make Another Donation
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Name & Email */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>

                    {/* Phone & Role */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Phone *</label>
                        <input
                          type="tel"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Role *</label>
                        <select
                          className="form-select"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          required
                        >
                          <option value="donor">Donor</option>
                          <option value="volunteer">Volunteer</option>
                          <option value="delivery_boy">Delivery Boy</option>
                        </select>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="mb-4">
                      <label className="form-label">Select Amount *</label>
                      <div className="btn-group d-flex mb-3" role="group">
                        {presetAmounts.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            className={`btn ${
                              formData.amount == amount ? 'btn-success' : 'btn-outline-success'
                            }`}
                            onClick={() =>
                              setFormData({ ...formData, amount: amount.toString() })
                            }
                          >
                            ₹{amount}
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                        name="amount"
                        placeholder="Or enter custom amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                      />
                      {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="btn btn-success btn-lg w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Processing...
                        </>
                      ) : (
                        `Donate ₹${formData.amount || '0'}`
                      )}
                    </button>

                    {errors.submit && (
                      <div className="alert alert-danger mt-3">{errors.submit}</div>
                    )}

                    <p className="text-center text-muted mt-3 small">
                      <i className="bi bi-shield-check"></i> Secure donation form. In production, integrate with a payment gateway.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
