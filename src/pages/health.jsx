import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const Health = () => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({ animalId: '', vetVisitDate: '', reminder: '', vaccination: '' });
  const [report, setReport] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  const fetchHealthRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/health', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setHealthRecords(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load health records');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('animalId', newRecord.animalId);
      formData.append('vetVisitDate', newRecord.vetVisitDate);
      formData.append('reminder', newRecord.reminder);
      formData.append('vaccination', newRecord.vaccination);
      if (report) formData.append('report', report);

      const res = await axios.post('http://localhost:5000/api/health', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
      });
      setHealthRecords([...healthRecords, res.data]);
      setNewRecord({ animalId: '', vetVisitDate: '', reminder: '', vaccination: '' });
      setReport(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add health record');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.put(`http://localhost:5000/api/health/${editRecord._id}`, editRecord, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setHealthRecords(healthRecords.map(r => (r._id === editRecord._id ? res.data : r)));
      setShowModal(false);
      setEditRecord(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update health record');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this health record?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/health/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setHealthRecords(healthRecords.filter(r => r._id !== id));
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to delete health record');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <Typography variant="h4" className="page-title slide-up">Health Management</Typography>
      {error && <Typography className="alert alert-warning">{error}</Typography>}
      <div className="form-group fade-in">
        <TextField label="Animal ID" value={newRecord.animalId} onChange={e => setNewRecord({ ...newRecord, animalId: e.target.value })} />
        <TextField label="Vet Visit Date" type="date" value={newRecord.vetVisitDate} onChange={e => setNewRecord({ ...newRecord, vetVisitDate: e.target.value })} InputLabelProps={{ shrink: true }} />
        <TextField label="Reminder Date" type="date" value={newRecord.reminder} onChange={e => setNewRecord({ ...newRecord, reminder: e.target.value })} InputLabelProps={{ shrink: true }} />
        <TextField label="Vaccination" value={newRecord.vaccination} onChange={e => setNewRecord({ ...newRecord, vaccination: e.target.value })} />
        <input type="file" onChange={e => setReport(e.target.files[0])} className="mt-1" />
        <Button onClick={handleAdd} className="btn-primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Add Health Record'}
        </Button>
      </div>
      {loading ? (
        <Typography className="text-center mt-2">Loading...</Typography>
      ) : (
        <div className="list-container health-list">
          {healthRecords.map(record => (
            <div key={record._id} className="list-item fade-in">
              <Typography>Animal ID: {record.animalId}</Typography>
              <Typography>Vet Visit: {new Date(record.vetVisitDate).toLocaleDateString()}</Typography>
              <Typography>Reminder: {new Date(record.reminder).toLocaleDateString()}</Typography>
              <Typography>Vaccination: {record.vaccination || 'N/A'}</Typography>
              {record.reportUrl && <a href={`http://localhost:5000${record.reportUrl}`} target="_blank" rel="noopener noreferrer" className="mt-05">View Report</a>}
              <div className="card-actions">
                <Button onClick={() => handleEdit(record)} className="btn-small btn-primary">Edit</Button>
                <Button onClick={() => handleDelete(record._id)} className="btn-small btn-secondary">Delete</Button>
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
              <Typography>Edit Health Record</Typography>
              <TextField label="Animal ID" value={editRecord.animalId} onChange={e => setEditRecord({ ...editRecord, animalId: e.target.value })} />
              <TextField label="Vet Visit Date" type="date" value={editRecord.vetVisitDate} onChange={e => setEditRecord({ ...editRecord, vetVisitDate: e.target.value })} InputLabelProps={{ shrink: true }} />
              <TextField label="Reminder Date" type="date" value={editRecord.reminder} onChange={e => setEditRecord({ ...editRecord, reminder: e.target.value })} InputLabelProps={{ shrink: true }} />
              <TextField label="Vaccination" value={editRecord.vaccination} onChange={e => setEditRecord({ ...editRecord, vaccination: e.target.value })} />
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

export default Health;