// src/pages/Contact.jsx
import React, { useState } from 'react';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Regex patterns
  const patterns = {
    name: /^[A-Za-z\s]{3,50}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^[6-9][0-9]{9}$/,
    message: /^[A-Za-z0-9\s.,!?'"-]{10,500}$/
  };

  // Error messages
  const errorMessages = {
    name: 'Name should only contain letters and spaces (3–50 characters).',
    email: 'Please enter a valid email address (e.g. user@example.com).',
    phone: 'Please enter a valid 10-digit mobile number starting with 6–9.',
    message: 'Message should be 10–500 characters long and contain only letters, numbers, spaces, or punctuation.'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');

    // Validate while typing
    if (!patterns[name].test(value)) {
      setErrors({ ...errors, [name]: errorMessages[name] });
    } else {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Final validation before submit
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!patterns[key].test(formData[key])) {
        newErrors[key] = errorMessages[key];
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/contact', formData);
      if (response.data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setErrors({});
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page py-5">
      <div className="container">
        <h1 className="text-center mb-5">Contact Us</h1>

        <div className="row">
          {/* Left side: Contact Form */}
          <div className="col-md-6">
            <h3>Get in Touch</h3>
            <p className="mb-4">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>

            {submitted && (
              <div className="alert alert-success alert-dismissible fade show">
                <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon.
                <button type="button" className="btn-close" onClick={() => setSubmitted(false)}></button>
              </div>
            )}

            {error && (
              <div className="alert alert-danger alert-dismissible fade show">
                <strong>Error!</strong> {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div className="mb-3">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
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
                  disabled={loading}
                  required
                />
                {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
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
                  placeholder="10-digit mobile number"
                  disabled={loading}
                  required
                />
                <small className="text-muted">Format: 9876543210</small>
                {errors.phone && <div className="text-danger mt-1">{errors.phone}</div>}
              </div>

              {/* Message */}
              <div className="mb-3">
                <label className="form-label">Message *</label>
                <textarea
                  className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={loading}
                  required
                ></textarea>
                {errors.message && <div className="text-danger mt-1">{errors.message}</div>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Right side: Office Details + Map */}
          <div className="col-md-6">
            <h3>Our Office</h3>
            <div className="card">
              <div className="card-body">
                <p>
                  <strong>Address:</strong><br />
                  GreenPulse India<br />
                  123 Environmental Street<br />
                  Mumbai, Maharashtra 400001
                </p>
                <p>
                  <strong>Email:</strong><br />info@greenpulse.in
                </p>
                <p>
                  <strong>Phone:</strong><br />+91 98765 43210
                </p>
                <p>
                  <strong>Working Hours:</strong><br />
                  Monday - Saturday: 9:00 AM - 6:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            <div className="mt-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
