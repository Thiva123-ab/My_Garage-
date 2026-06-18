import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = 'http://localhost:3001';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/services`).then(r => r.json()),
      fetch(`${API_URL}/api/jobs`).then(r => r.json()),
      fetch(`${API_URL}/api/team`).then(r => r.json()),
    ]).then(([s, j, t]) => {
      setServices(s);
      setJobs(j);
      setTeam(t);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;

  const pendingJobs = jobs.filter(j => j.status === 'Pending').length;
  const inProgressJobs = jobs.filter(j => j.status === 'In Progress').length;
  const completedJobs = jobs.filter(j => j.status === 'Completed' || j.status === 'Ready for Pickup').length;
  const totalRevenue = services.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="dashboard-welcome">Welcome back, <strong>{user?.name}</strong>. Here's your overview.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(0, 212, 255, 0.1)', color: 'var(--accent-primary)' }}>📊</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{jobs.length}</span>
            <span className="stat-card-label">Total Jobs</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(255, 145, 0, 0.1)', color: 'var(--accent-orange)' }}>⏳</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{pendingJobs}</span>
            <span className="stat-card-label">Pending</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(0, 212, 255, 0.1)', color: 'var(--accent-primary)' }}>🔧</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{inProgressJobs}</span>
            <span className="stat-card-label">In Progress</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(0, 230, 118, 0.1)', color: 'var(--accent-green)' }}>✅</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{completedJobs}</span>
            <span className="stat-card-label">Completed</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--accent-secondary)' }}>⚙️</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{services.length}</span>
            <span className="stat-card-label">Services</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(255, 51, 102, 0.1)', color: 'var(--accent-red)' }}>👥</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{team.length}</span>
            <span className="stat-card-label">Team Members</span>
          </div>
        </div>
      </div>

      {/* Recent Jobs Table */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>🗂️ All Jobs</h2>
          <span className="badge-count">{jobs.length} total</span>
        </div>
        <div className="jobs-table-wrapper">
          <table className="jobs-table">
            <thead>
              <tr><th>Job ID</th><th>Vehicle</th><th>Owner</th><th>Service</th><th>Status</th><th>ETA</th></tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{job.id}</td>
                  <td>{job.vehicle}</td>
                  <td>{job.owner}</td>
                  <td>{job.service}</td>
                  <td>
                    <span className={`status-badge ${job.status === 'Pending' ? 'pending' : job.status === 'In Progress' ? 'in-progress' : job.status === 'Ready for Pickup' ? 'ready' : 'completed'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>{job.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Overview */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>👨‍🔧 Team</h2>
          <span className="badge-count">{team.length} members</span>
        </div>
        <div className="team-grid">
          {team.map(m => (
            <div className="team-card" key={m.id}>
              <div className="team-avatar">{m.avatar}</div>
              <h3>{m.name}</h3>
              <div className="team-role">{m.role}</div>
              <div className="team-specialty">{m.specialty}</div>
              <div className="team-experience">{m.experience}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Management */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>⚙️ Services Catalog</h2>
          <span className="badge-count">{services.length} services</span>
        </div>
        <div className="admin-services-list">
          {services.map(s => (
            <div className="admin-service-row" key={s.id}>
              <span className="admin-service-icon">{s.icon}</span>
              <div className="admin-service-info">
                <strong>{s.name}</strong>
                <span>{s.category}</span>
              </div>
              <span className="admin-service-duration">{s.duration}</span>
              <span className="admin-service-price">${s.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
