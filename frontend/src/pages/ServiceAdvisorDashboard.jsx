import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ServiceAdvisorDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [services, setServices] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewJob, setShowNewJob] = useState(false);
  const [newJob, setNewJob] = useState({ vehicle: '', owner: '', service: '', mechanic: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/jobs`).then(r => r.json()),
      fetch(`${API_URL}/api/services`).then(r => r.json()),
      fetch(`${API_URL}/api/team`).then(r => r.json()),
    ]).then(([j, s, t]) => {
      setJobs(j);
      setServices(s);
      setTeam(t);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const jobPayload = {
        id: 'J' + String(jobs.length + 1).padStart(3, '0'),
        vehicle: newJob.vehicle,
        owner: newJob.owner,
        service: newJob.service,
        status: 'Pending',
        eta: 'TBD',
      };
      const res = await fetch(`${API_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobPayload),
      });
      const data = await res.json();
      if (res.ok) {
        setJobs(prev => [data.job || jobPayload, ...prev]);
        setNewJob({ vehicle: '', owner: '', service: '', mechanic: '' });
        setShowNewJob(false);
        setMessage('✅ Job created successfully!');
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Failed to create job. Please try again.');
    }
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;

  const todayBookings = jobs.length;
  const pendingAssign = jobs.filter(j => j.status === 'Pending').length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Service Advisor Dashboard</h1>
          <p className="dashboard-welcome">Welcome, <strong>{user?.name}</strong>. Manage bookings and assign jobs.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewJob(prev => !prev)}>
          {showNewJob ? '✕ Cancel' : '+ New Job'}
        </button>
      </div>

      {message && <div className="form-message success" style={{ marginBottom: '1.5rem' }}>{message}</div>}

      {/* Stats */}
      <div className="stats-grid stats-grid-sm">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(0, 212, 255, 0.1)', color: 'var(--accent-primary)' }}>📅</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{todayBookings}</span>
            <span className="stat-card-label">Total Bookings</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(255, 145, 0, 0.1)', color: 'var(--accent-orange)' }}>🔔</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{pendingAssign}</span>
            <span className="stat-card-label">Pending Assignment</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(0, 230, 118, 0.1)', color: 'var(--accent-green)' }}>👨‍🔧</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{team.length}</span>
            <span className="stat-card-label">Available Mechanics</span>
          </div>
        </div>
      </div>

      {/* New Job Form */}
      {showNewJob && (
        <div className="dashboard-section new-job-form-section">
          <h2>Create New Job</h2>
          <form className="new-job-form" onSubmit={handleCreateJob}>
            <div className="form-group">
              <label>Vehicle</label>
              <input type="text" value={newJob.vehicle} onChange={e => setNewJob(p => ({ ...p, vehicle: e.target.value }))} placeholder="e.g. 2022 Toyota Camry" required />
            </div>
            <div className="form-group">
              <label>Owner Name</label>
              <input type="text" value={newJob.owner} onChange={e => setNewJob(p => ({ ...p, owner: e.target.value }))} placeholder="Customer name" required />
            </div>
            <div className="form-group">
              <label>Service</label>
              <select value={newJob.service} onChange={e => setNewJob(p => ({ ...p, service: e.target.value }))} required>
                <option value="">Select service...</option>
                {services.map(s => <option key={s.id} value={s.name}>{s.name} — Rs.{s.price.toLocaleString('en-IN')}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Assign Mechanic</label>
              <select value={newJob.mechanic} onChange={e => setNewJob(p => ({ ...p, mechanic: e.target.value }))}>
                <option value="">Assign later...</option>
                {team.map(t => <option key={t.id} value={t.name}>{t.name} ({t.specialty})</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Create Job</button>
          </form>
        </div>
      )}

      {/* All Jobs */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>📋 All Jobs</h2>
          <span className="badge-count">{jobs.length} jobs</span>
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
    </div>
  );
};

export default ServiceAdvisorDashboard;
