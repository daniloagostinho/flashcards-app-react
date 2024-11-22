import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import App from '../App';
import SignUpPage from './SignUpPage';

const Main: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<App />} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/signup" element={<SignUpPage/>} />
      </Routes>
    </Router>
  );
};

export default Main;
