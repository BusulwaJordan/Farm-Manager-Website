import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx'; // New
import Dashboard from './pages/dashboard.jsx';
import Animals from './pages/Animals.jsx';
import Feed from './pages/feed.jsx';
import Health from './pages/health.jsx';
import Tasks from './pages/tasks.jsx';
import Resources from './pages/resources.jsx';
import Financials from './pages/financial.jsx';

const theme = createTheme({
  palette: {
    primary: { main: '#2E7D32' },
    secondary: { main: '#5D4037' },
    background: { default: '#F5F5F5' },
    text: { primary: '#424242' },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/login.jsx" component={Login} />
          <Route path="/register.jsx" component={Register} />
          <Route path="/Animal.jsx" component={Animals} />
          <Route path="/feed.jsx" component={Feed} />
          <Route path="/health.js" component={Health} />
          <Route path="/tasks.jsx" component={Tasks} />
          <Route path="/resources.jsx" component={Resources} />
          <Route path="/financial.jsx" component={Financials} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;