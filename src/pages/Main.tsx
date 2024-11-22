import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import App from '../App';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';

import ProtectedRoute from '../guards/ProtectedRoute';

const Main: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/app" element={<ProtectedRoute element={<App />} />} />
      </Routes>
    </Router>
  );
};

export default Main;
