import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Data States
  const [services, setServices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [team, setTeam] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form States for Services
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({ name: '', category: '', description: '', price: '', duration: '', icon: '🔧' });

  // Modal & Form States for Inventory
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);
  const [inventoryForm, setInventoryForm] = useState({ name: '', category: '', quantity: '', price: '', minStock: '', sku: '' });

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const fetchData = async () => {
    try {
      const [sRes, jRes, tRes, iRes] = await Promise.all([
        fetch(`${API_URL}/api/services`),
        fetch(`${API_URL}/api/jobs`),
        fetch(`${API_URL}/api/team`),
        fetch(`${API_URL}/api/inventory`),
      ]);
      const [s, j, t, i] = await Promise.all([sRes.json(), jRes.json(), tRes.json(), iRes.json()]);
      setServices(s);
      setJobs(j);
      setTeam(t);
      setInventory(i);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ============================================================
  // SERVICES CRUD
  // ============================================================
  const openAddService = () => {
    setEditingService(null);
    setServiceForm({ name: '', category: '', description: '', price: '', duration: '', icon: '🔧' });
    setShowServiceModal(true);
  };

  const openEditService = (srv) => {
    setEditingService(srv._docId);
    setServiceForm({ ...srv });
    setShowServiceModal(true);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingService ? 'PATCH' : 'POST';
      const url = editingService ? `${API_URL}/api/services/${editingService}` : `${API_URL}/api/services`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...serviceForm, price: Number(serviceForm.price) })
      });
      
      if (res.ok) {
        setShowServiceModal(false);
        fetchData(); // Refresh list
      }
    } catch (err) {
      console.error('Failed to save service', err);
    }
  };

  const handleDeleteService = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Service',
      message: 'Are you sure you want to delete this service?',
      onConfirm: async () => {
        try {
          await fetch(`${API_URL}/api/services/${id}`, { method: 'DELETE' });
          fetchData();
        } catch (err) {
          console.error('Failed to delete service', err);
        } finally {
          setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
        }
      }
    });
  };

  // ============================================================
  // INVENTORY CRUD
  // ============================================================
  const openAddInventory = () => {
    setEditingInventory(null);
    setInventoryForm({ name: '', category: '', quantity: '', price: '', minStock: '', sku: '' });
    setShowInventoryModal(true);
  };

  const openEditInventory = (item) => {
    setEditingInventory(item._docId);
    setInventoryForm({ ...item });
    setShowInventoryModal(true);
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingInventory ? 'PATCH' : 'POST';
      const url = editingInventory ? `${API_URL}/api/inventory/${editingInventory}` : `${API_URL}/api/inventory`;
      
      const payload = {
        ...inventoryForm,
        quantity: Number(inventoryForm.quantity),
        price: Number(inventoryForm.price),
        minStock: Number(inventoryForm.minStock)
      };
      // Auto-update status based on quantity if editing
      if (editingInventory) {
        payload.status = payload.quantity > 0 ? 'In Stock' : 'Out of Stock';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setShowInventoryModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to save inventory item', err);
    }
  };

  const handleDeleteInventory = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Inventory Item',
      message: 'Are you sure you want to delete this inventory item?',
      onConfirm: async () => {
        try {
          await fetch(`${API_URL}/api/inventory/${id}`, { method: 'DELETE' });
          fetchData();
        } catch (err) {
          console.error('Failed to delete inventory item', err);
        } finally {
          setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
        }
      }
    });
  };

  // ============================================================
  // JOB MANAGEMENT (ADMIN ACTIONS)
  // ============================================================
  const handleDeleteJob = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Job',
      message: 'Are you sure you want to delete this job?',
      onConfirm: async () => {
        try {
          await fetch(`${API_URL}/api/jobs/${id}`, { method: 'DELETE' });
          fetchData();
        } catch (err) {
          console.error('Failed to delete job', err);
        } finally {
          setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
        }
      }
    });
  };

  const handleUpdateJobStatus = async (id, newStatus) => {
    try {
      await fetch(`${API_URL}/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData();
    } catch (err) {
      console.error('Failed to update job status', err);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;

  const pendingJobs = jobs.filter(j => j.status === 'Pending').length;
  const inProgressJobs = jobs.filter(j => j.status === 'In Progress').length;
  const completedJobs = jobs.filter(j => j.status === 'Completed' || j.status === 'Ready for Pickup').length;
  
  const lowStockCount = inventory.filter(i => i.quantity <= i.minStock).length;

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
          <div className="stat-card-icon" style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--accent-secondary)' }}>⚙️</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{services.length}</span>
            <span className="stat-card-label">Services</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(255, 51, 102, 0.1)', color: 'var(--accent-red)' }}>📦</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{inventory.length}</span>
            <span className="stat-card-label">Inventory Items</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(255, 145, 0, 0.1)', color: 'var(--accent-orange)' }}>⚠️</div>
          <div className="stat-card-info">
            <span className="stat-card-value" style={{ color: lowStockCount > 0 ? 'var(--accent-orange)' : 'inherit' }}>{lowStockCount}</span>
            <span className="stat-card-label">Low Stock Alerts</span>
          </div>
        </div>
      </div>

      {/* INVENTORY MANAGEMENT */}
      <div className="dashboard-section">
        <div className="dashboard-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>📦 Inventory Management</h2>
            <span className="badge-count">{inventory.length} items</span>
          </div>
          <button className="btn btn-primary" onClick={openAddInventory}>+ Add Item</button>
        </div>
        <div className="jobs-table-wrapper">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item._docId}>
                  <td style={{ fontSize: '0.9rem', color: '#8892b0' }}>{item.sku}</td>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td>{item.category}</td>
                  <td>
                    <span style={{ color: item.quantity <= item.minStock ? 'var(--accent-orange)' : 'var(--accent-green)', fontWeight: 'bold' }}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>Rs.{item.price.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`status-badge ${item.status === 'In Stock' ? 'completed' : item.status === 'Low Stock' ? 'pending' : 'in-progress'}`}>
                      {item.quantity <= item.minStock && item.quantity > 0 ? 'Low Stock' : item.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btn-group">
                      <button className="action-btn edit-btn" onClick={() => openEditInventory(item)} title="Edit">✏️</button>
                      <button className="action-btn delete-btn" onClick={() => handleDeleteInventory(item._docId)} title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {inventory.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No inventory items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SERVICES MANAGEMENT */}
      <div className="dashboard-section">
        <div className="dashboard-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>⚙️ Services Catalog Management</h2>
            <span className="badge-count">{services.length} services</span>
          </div>
          <button className="btn btn-primary" onClick={openAddService}>+ Add Service</button>
        </div>
        <div className="admin-services-list">
          {services.map(s => (
            <div className="admin-service-row" key={s._docId} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="admin-service-icon">{s.icon}</span>
              <div className="admin-service-info" style={{ flex: 1 }}>
                <strong>{s.name}</strong>
                <span>{s.category}</span>
              </div>
              <span className="admin-service-duration">{s.duration}</span>
              <span className="admin-service-price" style={{ width: '100px', textAlign: 'right' }}>Rs.{s.price.toLocaleString('en-IN')}</span>
              <div className="action-btn-group" style={{ marginLeft: '1rem' }}>
                <button className="action-btn edit-btn" onClick={() => openEditService(s)} title="Edit">✏️</button>
                <button className="action-btn delete-btn" onClick={() => handleDeleteService(s._docId)} title="Delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Jobs Table */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>🗂️ All Jobs Overview</h2>
          <span className="badge-count">{jobs.length} total</span>
        </div>
        <div className="jobs-table-wrapper">
          <table className="jobs-table">
            <thead>
              <tr><th>Job ID</th><th>Vehicle</th><th>Owner</th><th>Service</th><th>Status</th><th>ETA</th><th>Manage</th></tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{job.id}</td>
                  <td>{job.vehicle}</td>
                  <td>{job.owner}</td>
                  <td>{job.service}</td>
                  <td>
                    <select 
                      value={job.status} 
                      onChange={(e) => handleUpdateJobStatus(job.id, e.target.value)}
                      style={{ 
                        background: 'rgba(0,0,0,0.3)', 
                        color: 'white', 
                        border: '1px solid rgba(255,255,255,0.2)', 
                        padding: '4px', 
                        borderRadius: '4px' 
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>{job.eta}</td>
                  <td>
                    <div className="action-btn-group">
                      <button className="action-btn delete-btn" onClick={() => handleDeleteJob(job.id)} title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* Service Modal */}
      {showServiceModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
            <form onSubmit={handleServiceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required type="text" placeholder="Service Name" value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              <input required type="text" placeholder="Category (e.g. Brakes)" value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              <input required type="number" placeholder="Price (Rs.)" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              <input required type="text" placeholder="Duration (e.g. 2 hrs)" value={serviceForm.duration} onChange={e => setServiceForm({...serviceForm, duration: e.target.value})} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              <input type="text" placeholder="Icon Emoji (e.g. 🔧)" value={serviceForm.icon} onChange={e => setServiceForm({...serviceForm, icon: e.target.value})} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Service</button>
                <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }} onClick={() => setShowServiceModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Modal */}
      {showInventoryModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>{editingInventory ? 'Edit Inventory Item' : 'Add Inventory Item'}</h2>
            <form onSubmit={handleInventorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required type="text" placeholder="Item Name (e.g. Synthetic Oil)" value={inventoryForm.name} onChange={e => setInventoryForm({...inventoryForm, name: e.target.value})} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              <input required type="text" placeholder="SKU" value={inventoryForm.sku} onChange={e => setInventoryForm({...inventoryForm, sku: e.target.value})} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              <input required type="text" placeholder="Category (e.g. Fluids)" value={inventoryForm.category} onChange={e => setInventoryForm({...inventoryForm, category: e.target.value})} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input required type="number" placeholder="Quantity in Stock" value={inventoryForm.quantity} onChange={e => setInventoryForm({...inventoryForm, quantity: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                <input required type="number" placeholder="Min Alert Stock" value={inventoryForm.minStock} onChange={e => setInventoryForm({...inventoryForm, minStock: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              </div>
              
              <input required type="number" step="0.01" placeholder="Price (Rs.)" value={inventoryForm.price} onChange={e => setInventoryForm({...inventoryForm, price: e.target.value})} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Item</button>
                <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }} onClick={() => setShowInventoryModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <h2 style={{ marginTop: 0, color: 'var(--accent-red)', marginBottom: '1rem' }}>{confirmModal.title}</h2>
            <p style={{ color: '#cbd5e1', marginBottom: '2rem', fontSize: '1.1rem' }}>{confirmModal.message}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                className="btn btn-primary" 
                style={{ background: 'var(--accent-red)', borderColor: 'var(--accent-red)', flex: 1, padding: '0.8rem' }}
                onClick={confirmModal.onConfirm}
              >
                Yes, Delete
              </button>
              <button 
                className="btn" 
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', flex: 1, padding: '0.8rem' }} 
                onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
