import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { Boxes, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await loginUser(formData);

      // Save authentication information
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username || '');
        localStorage.setItem('role', data.role || 'USER');

        navigate('/dashboard');
      } else {
        setError('Login failed: Token not returned from server.');
      }

    } catch (err) {
      console.error('Login error:', err);

      if (err.code === 'ERR_NETWORK') {
        setError(
          'Cannot connect to backend server at http://localhost:8081. Please ensure Spring Boot is running and CORS is configured.'
        );
      } else if (err.response && err.response.data) {

        const msg =
          typeof err.response.data === 'string'
            ? err.response.data
            : err.response.data.message ||
              'Invalid email or password.';

        setError(msg);

      } else {
        setError('Invalid email or password. Please try again.');
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-header">

          <div className="auth-icon-circle">
            <Boxes size={36} className="auth-brand-icon" />
          </div>

          <h2>Smart Inventory System</h2>

          <p>
            Sign in to manage your inventory and demand predictions
          </p>

        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">

          {/* Email */}
          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

          </div>

          {/* Password */}
          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >

            {loading ? (
              <span className="btn-loading">
                <span className="spinner-small"></span>
                Logging in...
              </span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Login</span>
              </>
            )}

          </button>

        </form>

        <div className="auth-footer">

          <p>
            Don't have an account?{' '}

            <Link
              to="/register"
              className="auth-link"
            >
              Register here
            </Link>

          </p>

        </div>

      </div>
    </div>
  );
};

export default Login;