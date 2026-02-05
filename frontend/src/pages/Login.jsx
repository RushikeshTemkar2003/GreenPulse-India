import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let msg = '';

    switch (name) {
      case 'email':
        if (!/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
          msg = 'Please enter a valid email address.';
        }
        break;

      case 'password':
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(value))
          msg = 'Password must be 8+ chars, with 1 uppercase, 1 lowercase & 1 special char.';
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
    const errorMsg = validateField(name, value);
    setErrors({ ...errors, [name]: errorMsg });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError('');

    // Validate all fields before submit
    const newErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password)
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((msg) => msg)) {
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      switch (result.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
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
      setServerError(result.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="login-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow">
              <div className="card-body p-5">
                <h2 className="text-center mb-4">🌿 Login</h2>

                {serverError && (
                  <div className="alert alert-danger">{serverError}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>

                <p className="text-center mb-0">
                  Don't have an account? <Link to="/signup">Sign up here</Link>
                </p>

                <hr />

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
