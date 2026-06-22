import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = 'http://localhost:3001';

const MechanicDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch(`${API_URL}/api/jobs`)
      .then(r => r.json())
      .then(data => { setJobs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (jobId, newStatus) => {
    try {
      await fetch(`${API_URL}/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setJobs(prev =>
        prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j)
      );
    } catch (err) {
      console.error('Failed to update job status:', err);
    }
  };

  const filteredJobs = filter === 'all' ? jobs : jobs.filter(j => {
    if (filter === 'active') return j.status === 'In Progress' || j.status === 'Pending';
    if (filter === 'done') return j.status === 'Completed' || j.status === 'Ready for Pickup';
    return true;
  });

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;

  const myActive = jobs.filter(j => j.status === 'In Progress').length;
  const myPending = jobs.filter(j => j.status === 'Pending').length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Mechanic Dashboard</h1>
          <p className="dashboard-welcome">Hello, <strong>{user?.name}</strong>. Here are your assigned jobs.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid stats-grid-sm">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(255, 145, 0, 0.1)', color: 'var(--accent-orange)' }}>📥</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{myPending}</span>
            <span className="stat-card-label">Pending Jobs</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(0, 212, 255, 0.1)', color: 'var(--accent-primary)' }}>🔧</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{myActive}</span>
            <span className="stat-card-label">Active Repairs</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(0, 230, 118, 0.1)', color: 'var(--accent-green)' }}>✅</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{jobs.filter(j => j.status === 'Completed').length}</span>
            <span className="stat-card-label">Completed Today</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>🛠️ Job Queue</h2>
          <div className="filter-tabs">
            {['all', 'active', 'done'].map(f => (
              <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mechanic-jobs">
          {filteredJobs.map(job => (
            <div className="mechanic-job-card" key={job.id}>
              <div className="mechanic-job-top">
                <span className="mechanic-job-id">{job.id}</span>
                <span className={`status-badge ${job.status === 'Pending' ? 'pending' : job.status === 'In Progress' ? 'in-progress' : job.status === 'Ready for Pickup' ? 'ready' : 'completed'}`}>
                  {job.status}
                </span>
              </div>
              <h3>{job.vehicle}</h3>
              <p className="mechanic-job-service">{job.service}</p>
              <p className="mechanic-job-owner">Owner: {job.owner}</p>
              <div className="mechanic-job-actions">
                {job.status === 'Pending' && (
                  <button className="btn btn-sm btn-primary" onClick={() => updateStatus(job.id, 'In Progress')}>
                    ▶ Start Work
                  </button>
                )}
                {job.status === 'In Progress' && (
                  <>
                    <button className="btn btn-sm btn-primary" onClick={() => updateStatus(job.id, 'Ready for Pickup')}>
                      ✅ Mark Ready
                    </button>
                  </>
                )}
                {(job.status === 'Ready for Pickup' || job.status === 'Completed') && (
                  <span className="mechanic-job-done">✔ Done</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MechanicDashboard;
