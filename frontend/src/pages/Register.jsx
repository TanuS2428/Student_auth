import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, AlertCircle, User, Mail, Lock, Book } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    course: 'Computer Science'
  });
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
      const res = await axios.post('http://localhost:5000/api/register', formData);
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
          <div style={{ textAlign: 'center', color: '#1d4ed8', fontWeight: 'bold' }}>
            <div style={{ border: '2px solid #1d4ed8', padding: '5px 10px', display: 'inline-block' }}>KIET</div>
            <div style={{ fontSize: '10px', marginTop: '4px' }}>GROUP OF INSTITUTIONS</div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#e5e7eb' }}></div>
          <div style={{ textAlign: 'center', color: '#ec4899', fontWeight: 'bold', fontStyle: 'italic', fontSize: '18px' }}>
            CYBER Vidya
          </div>
        </div>

        <h2 style={{ textAlign: 'center' }}>Student Registration</h2>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <User size={16} className="input-icon" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email (User Name)</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Mail size={16} className="input-icon" />
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
            <Lock size={16} className="input-icon" />
          </div>

          <div className="form-group">
            <label htmlFor="course">Course</label>
            <select
              id="course"
              name="course"
              className="form-control"
              value={formData.course}
              onChange={handleChange}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Data Science">Data Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
            <Book size={16} className="input-icon" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        <div className="auth-link-center">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
