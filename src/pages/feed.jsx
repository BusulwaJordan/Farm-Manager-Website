import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [newFeed, setNewFeed] = useState({ type: '', stock: '', cost: '' });
  const [editFeed, setEditFeed] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/feed', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setFeeds(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load feeds');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/feed', newFeed, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setFeeds([...feeds, res.data]);
      if (res.data.stock < 10) alert('Low feed stock!');
      setNewFeed({ type: '', stock: '', cost: '' });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add feed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feed) => {
    setEditFeed(feed);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.put(`http://localhost:5000/api/feed/${editFeed._id}`, editFeed, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setFeeds(feeds.map(f => (f._id === editFeed._id ? res.data : f)));
      setShowModal(false);
      setEditFeed(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update feed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feed?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/feed/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setFeeds(feeds.filter(f => f._id !== id));
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to delete feed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <Typography variant="h4" className="page-title slide-up">Feed Management</Typography>
      {error && <Typography className="alert alert-warning">{error}</Typography>}
      <div className="form-group fade-in">
        <TextField label="Feed Type" value={newFeed.type} onChange={e => setNewFeed({ ...newFeed, type: e.target.value })} />
        <TextField label="Stock (kg)" type="number" value={newFeed.stock} onChange={e => setNewFeed({ ...newFeed, stock: e.target.value })} />
        <TextField label="Cost ($)" type="number" value={newFeed.cost} onChange={e => setNewFeed({ ...newFeed, cost: e.target.value })} />
        <Button onClick={handleAdd} className="btn-primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Add Feed'}
        </Button>
      </div>
      {loading ? (
        <Typography className="text-center mt-2">Loading...</Typography>
      ) : (
        <div className="list-container feed-list">
          {feeds.map(feed => (
            <div key={feed._id} className="list-item fade-in">
              <Typography>Type: {feed.type}</Typography>
              <Typography>Stock: {feed.stock} kg</Typography>
              <Typography>Cost: ${feed.cost}</Typography>
              {feed.stock < 10 && <div className="alert alert-warning">Low Stock!</div>}
              <div className="card-actions">
                <Button onClick={() => handleEdit(feed)} className="btn-small btn-primary">Edit</Button>
                <Button onClick={() => handleDelete(feed._id)} className="btn-small btn-secondary">Delete</Button>
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
              <Typography>Edit Feed</Typography>
              <TextField label="Feed Type" value={editFeed.type} onChange={e => setEditFeed({ ...editFeed, type: e.target.value })} />
              <TextField label="Stock (kg)" type="number" value={editFeed.stock} onChange={e => setEditFeed({ ...editFeed, stock: e.target.value })} />
              <TextField label="Cost ($)" type="number" value={editFeed.cost} onChange={e => setEditFeed({ ...editFeed, cost: e.target.value })} />
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

export default Feed;