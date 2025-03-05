import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, Checkbox, CircularProgress } from '@mui/material';
import axios from 'axios';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ description: '', assignedTo: '', dueDate: '', recurring: false });
  const [editTask, setEditTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', newTask, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setTasks([...tasks, res.data]);
      setNewTask({ description: '', assignedTo: '', dueDate: '', recurring: false });
      alert(`Task assigned to ${res.data.assignedTo}`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${editTask._id}`, editTask, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setTasks(tasks.map(t => (t._id === editTask._id ? res.data : t)));
      setShowModal(false);
      setEditTask(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id, completed) => {
    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setTasks(tasks.map(t => (t._id === id ? res.data : t)));
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setTasks(tasks.filter(t => t._id !== id));
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to delete task');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <Typography variant="h4" className="page-title slide-up">Task Management</Typography>
      {error && <Typography className="alert alert-warning">{error}</Typography>}
      <div className="form-group fade-in">
        <TextField label="Description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
        <TextField label="Assigned To" value={newTask.assignedTo} onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })} />
        <TextField label="Due Date" type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} InputLabelProps={{ shrink: true }} />
        <TextField
          select
          label="Recurring"
          value={newTask.recurring}
          onChange={e => setNewTask({ ...newTask, recurring: e.target.value === 'true' })}
        >
          <MenuItem value={true}>Yes</MenuItem>
          <MenuItem value={false}>No</MenuItem>
        </TextField>
        <Button onClick={handleAdd} className="btn-primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Add Task'}
        </Button>
      </div>
      {loading ? (
        <Typography className="text-center mt-2">Loading...</Typography>
      ) : (
        <div className="list-container tasks-list">
          {tasks.map(task => (
            <div key={task._id} className="list-item fade-in">
              <Checkbox checked={task.completed} onChange={() => handleComplete(task._id, task.completed)} />
              <Typography>{task.description}</Typography>
              <Typography>Assigned To: {task.assignedTo}</Typography>
              <Typography>Due: {new Date(task.dueDate).toLocaleDateString()}</Typography>
              <Typography>Recurring: {task.recurring ? 'Yes' : 'No'}</Typography>
              <div className="card-actions">
                <Button onClick={() => handleEdit(task)} className="btn-small btn-primary">Edit</Button>
                <Button onClick={() => handleDelete(task._id)} className="btn-small btn-secondary">Delete</Button>
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
              <Typography>Edit Task</Typography>
              <TextField label="Description" value={editTask.description} onChange={e => setEditTask({ ...editTask, description: e.target.value })} />
              <TextField label="Assigned To" value={editTask.assignedTo} onChange={e => setEditTask({ ...editTask, assignedTo: e.target.value })} />
              <TextField label="Due Date" type="date" value={editTask.dueDate} onChange={e => setEditTask({ ...editTask, dueDate: e.target.value })} InputLabelProps={{ shrink: true }} />
              <TextField
                select
                label="Recurring"
                value={editTask.recurring}
                onChange={e => setEditTask({ ...editTask, recurring: e.target.value === 'true' })}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </TextField>
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

export default Tasks;