import React, { useEffect, useState } from 'react';
import { Button, TextField, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const Animals = () => {
  const [animals, setAnimals] = useState([]);
  const [newAnimal, setNewAnimal] = useState({ species: '', breed: '', animalId: '', birthDate: '' });
  const [editAnimal, setEditAnimal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/animals', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setAnimals(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load animals');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/animals', newAnimal, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setAnimals([...animals, res.data]);
      setNewAnimal({ species: '', breed: '', animalId: '', birthDate: '' });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add animal');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (animal) => {
    setEditAnimal(animal);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.put(`http://localhost:5000/api/animals/${editAnimal._id}`, editAnimal, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setAnimals(animals.map(a => (a._id === editAnimal._id ? res.data : a)));
      setShowModal(false);
      setEditAnimal(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update animal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/animals/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setAnimals(animals.filter(a => a._id !== id));
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to delete animal');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExport = () => {
    axios.get('http://localhost:5000/api/animals/export', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, responseType: 'blob' })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'animals.csv');
        document.body.appendChild(link);
        link.click();
      });
  };

  return (
    <div className="container">
      <Typography variant="h4" className="page-title slide-up">Animal Management</Typography>
      {error && <Typography className="alert alert-warning">{error}</Typography>}
      <div className="form-group fade-in">
        <TextField label="Species" value={newAnimal.species} onChange={e => setNewAnimal({ ...newAnimal, species: e.target.value })} />
        <TextField label="Breed" value={newAnimal.breed} onChange={e => setNewAnimal({ ...newAnimal, breed: e.target.value })} />
        <TextField label="Animal ID" value={newAnimal.animalId} onChange={e => setNewAnimal({ ...newAnimal, animalId: e.target.value })} />
        <TextField label="Birth Date" type="date" value={newAnimal.birthDate} onChange={e => setNewAnimal({ ...newAnimal, birthDate: e.target.value })} InputLabelProps={{ shrink: true }} />
        <Button onClick={handleAdd} className="btn-primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Add Animal'}
        </Button>
        <Button onClick={handleExport} className="btn-secondary">Export CSV</Button>
      </div>
      {loading ? (
        <Typography className="text-center mt-2">Loading...</Typography>
      ) : (
        <div className="list-container animals-list">
          {animals.map(animal => (
            <Card key={animal._id} className="card fade-in">
              <CardContent className="card-content">
                <Typography>ID: {animal.animalId}</Typography>
                <Typography>Species: {animal.species}</Typography>
                <Typography>Breed: {animal.breed}</Typography>
                <Typography>Birth Date: {new Date(animal.birthDate).toLocaleDateString()}</Typography>
              </CardContent>
              <div className="card-actions">
                <Button onClick={() => handleEdit(animal)} className="btn-small btn-primary">Edit</Button>
                <Button onClick={() => handleDelete(animal._id)} className="btn-small btn-secondary">Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {showModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)} />
          <div className="modal slide-up">
            <div className="modal-content">
              <Typography>Edit Animal</Typography>
              <TextField label="Species" value={editAnimal.species} onChange={e => setEditAnimal({ ...editAnimal, species: e.target.value })} />
              <TextField label="Breed" value={editAnimal.breed} onChange={e => setEditAnimal({ ...editAnimal, breed: e.target.value })} />
              <TextField label="Animal ID" value={editAnimal.animalId} onChange={e => setEditAnimal({ ...editAnimal, animalId: e.target.value })} />
              <TextField label="Birth Date" type="date" value={editAnimal.birthDate} onChange={e => setEditAnimal({ ...editAnimal, birthDate: e.target.value })} InputLabelProps={{ shrink: true }} />
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

export default Animals;