import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'volunteer',
    vehicle_type: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // ✅ Field-wise validation logic
  const validateField = (name, value) => {
    let msg = '';

    switch (name) {
      case 'name':
        if (!/^[A-Za-z\s]{3,}$/.test(value))
          msg = 'Name must contain only letters & spaces (min 3 characters).';
        break;

      case 'email':
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(value))
          msg = 'Enter a valid email address (e.g., name@example.com).';
        break;

      case 'phone':
        if (!/^[6-9][0-9]{9}$/.test(value))
          msg = 'Phone number must start with 6–9 and be 10 digits long.';
        break;

      case 'password':
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(value))
          msg = 'Password must be 8+ chars, with 1 uppercase, 1 lowercase & 1 special char.';
        break;

      case 'confirmPassword':
        if (value !== formData.password)
          msg = 'Passwords do not match.';
        break;

      case 'vehicle_type':
        if (formData.role === 'delivery_boy' && !value)
          msg = 'Please select a vehicle type.';
        break;

      default:
        break;
    }

    return msg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    // Validate field instantly
    const msg = validateField(name, value);
    setErrors({ ...errors, [name]: msg });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const msg = validateField(key, formData[key]);
      if (msg) newErrors[key] = msg;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setServerError('');

    const { confirmPassword, ...dataToSend } = formData;
    const result = await register(dataToSend);
    setLoading(false);

    if (result.success) {
      switch (result.user.role) {
        case 'volunteer':
          navigate('/volunteer/dashboard');
          break;
        case 'delivery_boy':
          navigate('/delivery/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      setServerError(result.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-body p-5">
                <h2 className="text-center mb-4">🌿 Sign Up</h2>

                {serverError && (
                  <div className="alert alert-danger">{serverError}</div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
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
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>

                  {/* Role */}
                  <div className="mb-3">
                    <label className="form-label">I want to join as *</label>
                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    >
                      <option value="volunteer">Volunteer</option>
                      <option value="delivery_boy">Delivery Boy</option>
                    </select>
                  </div>

                  {/* Vehicle Type */}
                  {formData.role === 'delivery_boy' && (
                    <div className="mb-3">
                      <label className="form-label">Vehicle Type *</label>
                      <select
                        className={`form-select ${errors.vehicle_type ? 'is-invalid' : ''}`}
                        name="vehicle_type"
                        value={formData.vehicle_type}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      >
                        <option value="">Select vehicle</option>
                        <option value="bike">Bike</option>
                        <option value="scooter">Scooter</option>
                        <option value="bicycle">Bicycle</option>
                        <option value="car">Car</option>
                        <option value="van">Van</option>
                      </select>
                      {errors.vehicle_type && (
                        <div className="invalid-feedback">{errors.vehicle_type}</div>
                      )}
                    </div>
                  )}

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    <small className="text-muted">
                      At least 8 characters, with 1 uppercase, 1 lowercase, and 1 special character
                    </small>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-3">
                    <label className="form-label">Confirm Password *</label>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn btn-success w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </button>
                </form>

                <p className="text-center mb-0">
                  Already have an account? <Link to="/login">Login here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
