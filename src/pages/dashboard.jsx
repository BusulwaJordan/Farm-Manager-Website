import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ animals: 0, tasks: 0, financials: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const [animalsRes, tasksRes, financialsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/animals', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/tasks', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/financials/report', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStats({
          animals: animalsRes.data.length,
          tasks: tasksRes.data.filter(t => !t.completed).length,
          financials: financialsRes.data.profit || 0,
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container fade-in">
      <Typography variant="h4" className="page-title">Dashboard</Typography>
      <Typography variant="h6" className="text-center mt-2 slide-up">
        Welcome to Farm Management! Here's your overview:
      </Typography>
      {loading ? (
        <Typography className="text-center mt-2">Loading...</Typography>
      ) : (
        <div className="list-container mt-2">
          <Card className="card fade-in">
            <CardContent className="card-content">
              <Typography variant="h6">Total Animals</Typography>
              <Typography className="text-large">{stats.animals}</Typography>
            </CardContent>
          </Card>
          <Card className="card fade-in">
            <CardContent className="card-content">
              <Typography variant="h6">Pending Tasks</Typography>
              <Typography className="text-large">{stats.tasks}</Typography>
            </CardContent>
          </Card>
          <Card className="card fade-in">
            <CardContent className="card-content">
              <Typography variant="h6">Profit</Typography>
              <Typography className="text-large">${stats.financials.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;