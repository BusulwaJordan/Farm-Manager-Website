import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';

const Navbar = () => {
  const history = useHistory();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }} className="fade-in">
          Farm Management
        </Typography>
        {isLoggedIn ? (
          <>
            <Button color="inherit" component={Link} to="/" data-tooltip="Home">Dashboard</Button>
            <Button color="inherit" component={Link} to="/animals" data-tooltip="Manage Animals">Animals</Button>
            <Button color="inherit" component={Link} to="/feed" data-tooltip="Feed Inventory">Feed</Button>
            <Button color="inherit" component={Link} to="/health" data-tooltip="Health Records">Health</Button>
            <Button color="inherit" component={Link} to="/tasks" data-tooltip="Task List">Tasks</Button>
            <Button color="inherit" component={Link} to="/resources" data-tooltip="Resources">Resources</Button>
            <Button color="inherit" component={Link} to="/financials" data-tooltip="Financials">Financials</Button>
            <Button color="inherit" onClick={handleLogout} data-tooltip="Sign Out">Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login" data-tooltip="Sign In">Login</Button>
            <Button color="inherit" component={Link} to="/register" data-tooltip="Sign Up">Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;