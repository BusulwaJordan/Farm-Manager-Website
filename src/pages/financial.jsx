import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, FormControlLabel, Radio, RadioGroup, CircularProgress } from '@mui/material';
import axios from 'axios';

const Financials = () => {
  const [financials, setFinancials] = useState([]);
  const [newFinancial, setNewFinancial] = useState({ type: 'income', amount: '', description: '' });
  const [editFinancial, setEditFinancial] = useState(null);
  const [report, setReport] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFinancials();
  }, []);

  const fetchFinancials = async () => {
    setLoading(true);
    try {
      const [financialsRes, reportRes] = await Promise.all([
        axios.get('http://localhost:5000/api/financials', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get('http://localhost:5000/api/financials/report', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
      ]);
      setFinancials(financialsRes.data);
      setReport(reportRes.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load financials');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/financials', newFinancial, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setFinancials([...financials, res.data]);
      setNewFinancial({ type: 'income', amount: '', description: '' });
      const reportRes = await axios.get('http://localhost:5000/api/financials/report', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setReport(reportRes.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add financial entry');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (financial) => {
    setEditFinancial(financial);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.put(`http://localhost:5000/api/financials/${editFinancial._id}`, editFinancial, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setFinancials(financials.map(f => (f._id === editFinancial._id ? res.data : f)));
      setShowModal(false);
      setEditFinancial(null);
      const reportRes = await axios.get('http://localhost:5000/api/financials/report', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setReport(reportRes.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update financial entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this financial entry?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/financials/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setFinancials(financials.filter(f => f._id !== id));
        const reportRes = await axios.get('http://localhost:5000/api/financials/report', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setReport(reportRes.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to delete financial entry');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <Typography variant="h4" className="page-title slide-up">Financial Management</Typography>
      {error && <Typography className="alert alert-warning">{error}</Typography>}
      <div className="form-group fade-in">
        <RadioGroup row value={newFinancial.type} onChange={e => setNewFinancial({ ...newFinancial, type: e.target.value })}>
          <FormControlLabel value="income" control={<Radio />} label="Income" />
          <FormControlLabel value="expense" control={<Radio />} label="Expense" />
        </RadioGroup>
        <TextField label="Amount" type="number" value={newFinancial.amount} onChange={e => setNewFinancial({ ...newFinancial, amount: e.target.value })} />
        <TextField label="Description" value={newFinancial.description} onChange={e => setNewFinancial({ ...newFinancial, description: e.target.value })} />
        <Button onClick={handleAdd} className="btn-primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Add Financial'}
        </Button>
      </div>
      {loading ? (
        <Typography className="text-center mt-2">Loading...</Typography>
      ) : (
        <>
          <div className="list-container financials-list">
            {financials.map(financial => (
              <div key={financial._id} className="list-item fade-in">
                <Typography>Type: {financial.type}</Typography>
                <Typography>Amount: ${financial.amount}</Typography>
                <Typography>Description: {financial.description}</Typography>
                <Typography>Date: {new Date(financial.date).toLocaleDateString()}</Typography>
                <div className="card-actions">
                  <Button onClick={() => handleEdit(financial)} className="btn-small btn-primary">Edit</Button>
                  <Button onClick={() => handleDelete(financial._id)} className="btn-small btn-secondary">Delete</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="financials-report mt-2 fade-in">
            <Typography variant="h6">Financial Report</Typography>
            <Typography>Total Income: ${report.totalIncome || 0}</Typography>
            <Typography>Total Expense: ${report.totalExpense || 0}</Typography>
            <Typography>Profit: ${report.profit || 0}</Typography>
          </div>
        </>
      )}
      {showModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)} />
          <div className="modal slide-up">
            <div className="modal-content">
              <Typography>Edit Financial Entry</Typography>
              <RadioGroup row value={editFinancial.type} onChange={e => setEditFinancial({ ...editFinancial, type: e.target.value })}>
                <FormControlLabel value="income" control={<Radio />} label="Income" />
                <FormControlLabel value="expense" control={<Radio />} label="Expense" />
              </RadioGroup>
              <TextField label="Amount" type="number" value={editFinancial.amount} onChange={e => setEditFinancial({ ...editFinancial, amount: e.target.value })} />
              <TextField label="Description" value={editFinancial.description} onChange={e => setEditFinancial({ ...editFinancial, description: e.target.value })} />
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

export default Financials;