import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Home, Bell, LayoutDashboard, BookOpen, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '' });
  const [courseForm, setCourseForm] = useState({ course: '' });

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudent(res.data);
      setCourseForm({ course: res.data.course });
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError('Failed to load student data');
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/update-password`, passForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg('Password updated successfully');
      setPassForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleCourseUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/update-course`, courseForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg('Course updated successfully');
      setStudent({ ...student, course: res.data.course });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading your portal...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-left">
          <div style={{ color: '#1d4ed8', fontWeight: 'bold', fontSize: '18px' }}>KIET Portal</div>
        </div>
        <div className="topbar-right">
          <div className="topbar-icons">
            <Home size={20} />
            <Bell size={20} />
          </div>
          <div className="welcome-text">
            Welcome <span style={{ color: '#d97706', fontWeight: 'bold', textTransform: 'uppercase' }}>{student?.name?.split(' ')[0]}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>

      <div className="main-area">
        {/* Sidebar */}
        <div className="sidebar">
          <ul className="sidebar-menu">
            <li className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <div className="sidebar-item-content">
                <LayoutDashboard size={18} />
                Dashboard
              </div>
            </li>
            <li className={`sidebar-item ${activeTab === 'course' ? 'active' : ''}`} onClick={() => setActiveTab('course')}>
              <div className="sidebar-item-content">
                <BookOpen size={18} />
                Change Course
              </div>
            </li>
            <li className={`sidebar-item ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>
              <div className="sidebar-item-content">
                <KeyRound size={18} />
                Update Password
              </div>
            </li>
          </ul>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          
          {successMsg && (
            <div className="alert alert-success">
              <CheckCircle size={16} />
              {successMsg}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div>
              <h2 className="card-title" style={{ borderBottom: 'none', fontSize: '24px', marginBottom: '24px' }}>Dashboard Overview</h2>
              <div className="card">
                <h3 className="card-title">Student Information</h3>
                <div className="info-item">
                  <div className="info-label">Full Name</div>
                  <div className="info-value">{student?.name}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Email Address</div>
                  <div className="info-value">{student?.email}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Current Course</div>
                  <div className="info-value" style={{ color: 'var(--primary)' }}>{student?.course}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'course' && (
            <div>
              <h2 className="card-title" style={{ borderBottom: 'none', fontSize: '24px', marginBottom: '24px' }}>Academic Settings</h2>
              <div className="card" style={{ maxWidth: '600px' }}>
                <h3 className="card-title">Change Current Course</h3>
                <form onSubmit={handleCourseUpdate}>
                  <div className="form-group">
                    <label>Select New Course</label>
                    <select
                      className="form-control"
                      value={courseForm.course}
                      onChange={(e) => setCourseForm({ course: e.target.value })}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Save Course</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div>
              <h2 className="card-title" style={{ borderBottom: 'none', fontSize: '24px', marginBottom: '24px' }}>Security Settings</h2>
              <div className="card" style={{ maxWidth: '600px' }}>
                <h3 className="card-title">Update Password</h3>
                <form onSubmit={handlePasswordUpdate}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter current password"
                      value={passForm.oldPassword}
                      onChange={(e) => setPassForm({ ...passForm, oldPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter new password"
                      value={passForm.newPassword}
                      onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Update Password</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
