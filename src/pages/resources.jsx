import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ name: '', maintenanceDate: '', waterUsage: '', cost: '' });
  const [editResource, setEditResource] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/resources', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setResources(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/resources', {
        ...newResource,
        waterUsage: { amount: parseFloat(newResource.waterUsage), date: new Date() },
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setResources([...resources, res.data]);
      setNewResource({ name: '', maintenanceDate: '', waterUsage: '', cost: '' });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add resource');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resource) => {
    setEditResource({ ...resource, waterUsage: resource.waterUsage?.amount || '' });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.put(`http://localhost:5000/api/resources/${editResource._id}`, {
        ...editResource,
        waterUsage: { amount: parseFloat(editResource.waterUsage), date: new Date() },
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setResources(resources.map(r => (r._id === editResource._id ? res.data : r)));
      setShowModal(false);
      setEditResource(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update resource');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/resources/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setResources(resources.filter(r => r._id !== id));
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to delete resource');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <Typography variant="h4" className="page-title slide-up">Resource Management</Typography>
      {error && <Typography className="alert alert-warning">{error}</Typography>}
      <div className="form-group fade-in">
        <TextField label="Resource Name" value={newResource.name} onChange={e => setNewResource({ ...newResource, name: e.target.value })} />
        <TextField label="Maintenance Date" type="date" value={newResource.maintenanceDate} onChange={e => setNewResource({ ...newResource, maintenanceDate: e.target.value })} InputLabelProps={{ shrink: true }} />
        <TextField label="Water Usage (liters)" type="number" value={newResource.waterUsage} onChange={e => setNewResource({ ...newResource, waterUsage: e.target.value })} />
        <TextField label="Cost ($)" type="number" value={newResource.cost} onChange={e => setNewResource({ ...newResource, cost: e.target.value })} />
        <Button onClick={handleAdd} className="btn-primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Add Resource'}
        </Button>
      </div>
      {loading ? (
        <Typography className="text-center mt-2">Loading...</Typography>
      ) : (
        <div className="list-container resources-list">
          {resources.map(resource => (
            <div key={resource._id} className="list-item fade-in">
              <Typography>Name: {resource.name}</Typography>
              <Typography>Maintenance: {new Date(resource.maintenanceDate).toLocaleDateString()}</Typography>
              <Typography>Water Usage: {resource.waterUsage?.amount} liters</Typography>
              <Typography>Cost: ${resource.cost}</Typography>
              <div className="card-actions">
                <Button onClick={() => handleEdit(resource)} className="btn-small btn-primary">Edit</Button>
                <Button onClick={() => handleDelete(resource._id)} className="btn-small btn-secondary">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)} />
          <div className="modal slide-up">
            <div className="modal-content">
              <Typography>Edit Resource</Typography>
              <TextField label="Resource Name" value={editResource.name} onChange={e => setEditResource({ ...editResource, name: e.target.value })} />
              <TextField label="Maintenance Date" type="date" value={editResource.maintenanceDate} onChange={e => setEditResource({ ...editResource, maintenanceDate: e.target.value })} InputLabelProps={{ shrink: true }} />
              <TextField label="Water Usage (liters)" type="number" value={editResource.waterUsage} onChange={e => setEditResource({ ...editResource, waterUsage: e.target.value })} />
              <TextField label="Cost ($)" type="number" value={editResource.cost} onChange={e => setEditResource({ ...editResource, cost: e.target.value })} />
              <Button onClick={handleUpdate} className="btn-primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Update'}
              </Button>
              <Button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Resources;