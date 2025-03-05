import React, { useState } from 'react';
import { Button, TextField, Typography, CircularProgress, MenuItem } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Worker');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password, role });
      localStorage.setItem('token', res.data.token);
      history.push('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form slide-up">
        <Typography variant="h4" className="page-title">Register</Typography>
        {error && <Typography className="alert alert-warning">{error}</Typography>}
        <div className="form-group">
          <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} fullWidth className="fade-in" />
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth className="fade-in" />
          <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth className="fade-in" />
          <TextField
            select
            label="Role"
            value={role}
            onChange={e => setRole(e.target.value)}
            fullWidth
            className="fade-in"
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Farmer">Farmer</MenuItem>
            <MenuItem value="Worker">Worker</MenuItem>
          </TextField>
          <Button onClick={handleRegister} className="btn-primary pulse" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
          <Typography className="mt-1">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Register;