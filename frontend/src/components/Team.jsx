import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Team = () => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/team`)
      .then(r => r.json())
      .then(data => setTeam(data))
      .catch(console.error);
  }, []);

  if (team.length === 0) return null;

  return (
    <section className="section team-section" id="team">
      <div className="container">
        <div className="section-header">
          <div className="section-label">👨‍🔧 Our Experts</div>
          <h2 className="section-title">Meet the Team</h2>
          <p className="section-subtitle">
            Certified professionals with decades of combined experience in automotive repair.
          </p>
        </div>

        <div className="team-grid">
          {team.map((member, index) => (
            <div
              className="team-card fade-in-up"
              key={member.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="team-avatar">{member.avatar}</div>
              <h3>{member.name}</h3>
              <div className="team-role">{member.role}</div>
              <div className="team-specialty">{member.specialty}</div>
              <div className="team-experience">{member.experience}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
