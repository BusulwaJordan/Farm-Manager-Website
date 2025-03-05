import React, { useState } from 'react';
import { Button, TextField, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      history.push('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form slide-up">
        <Typography variant="h4" className="page-title">Login</Typography>
        {error && <Typography className="alert alert-warning">{error}</Typography>}
        <div className="form-group">
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth className="fade-in" />
          <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth className="fade-in" />
          <Button onClick={handleLogin} className="btn-primary pulse" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
          <Typography className="mt-1">
            Don't have an account? <Link to="/register">Register</Link>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Login;