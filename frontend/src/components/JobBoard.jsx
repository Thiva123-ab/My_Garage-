import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/jobs`)
      .then(r => r.json())
      .then(data => { setJobs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'pending';
      case 'In Progress': return 'in-progress';
      case 'Ready for Pickup': return 'ready';
      case 'Completed': return 'completed';
      default: return '';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Pending': return '🟠';
      case 'In Progress': return '🔵';
      case 'Ready for Pickup': return '🟢';
      case 'Completed': return '🟣';
      default: return '⚪';
    }
  };

  if (loading) return null;

  return (
    <section className="section job-board-section" id="job-board">
      <div className="container">
        <div className="section-header">
          <div className="section-label">📋 Live Updates</div>
          <h2 className="section-title">Vehicle Job Board</h2>
          <p className="section-subtitle">
            Track the real-time status of vehicles currently in our workshop.
          </p>
        </div>

        <div className="jobs-table-wrapper">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Vehicle</th>
                <th>Owner</th>
                <th>Service</th>
                <th>Status</th>
                <th>ETA</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{job.id}</td>
                  <td>{job.vehicle}</td>
                  <td>{job.owner}</td>
                  <td>{job.service}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(job.status)}`}>
                      {getStatusDot(job.status)} {job.status}
                    </span>
                  </td>
                  <td>{job.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default JobBoard;
