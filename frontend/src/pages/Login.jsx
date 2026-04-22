import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, AlertCircle, User, EyeOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/login`, formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logos">
          {/* Using text/icons as placeholder for KIET / Cyber Vidya logos */}
          <div style={{ textAlign: 'center', color: '#1d4ed8', fontWeight: 'bold' }}>
            <div style={{ border: '2px solid #1d4ed8', padding: '5px 10px', display: 'inline-block' }}>KIET</div>
            <div style={{ fontSize: '10px', marginTop: '4px' }}>GROUP OF INSTITUTIONS</div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#e5e7eb' }}></div>
          <div style={{ textAlign: 'center', color: '#ec4899', fontWeight: 'bold', fontStyle: 'italic', fontSize: '18px' }}>
            CYBER Vidya
          </div>
        </div>

        <h2 style={{ textAlign: 'center' }}>Sign In</h2>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">User Name</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <User size={16} className="input-icon" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <EyeOff size={16} className="input-icon" />
          </div>

          <div className="auth-link">
            <a href="#">Forgot Password?</a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
             <button type="submit" className="btn btn-primary" disabled={loading}>
               {loading ? 'Signing in...' : 'Login'}
             </button>
          </div>
        </form>

        <div className="auth-link-center" style={{ marginTop: '30px' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
