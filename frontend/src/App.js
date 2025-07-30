import React from 'react';
import './App.css';
import { Provider, useDispatch } from 'react-redux';
import store from './redux/store';
import LoginPage from './pages/auth/login/Login.jsx';
import SignupPage from './pages/auth/signup/Signup.jsx';
import FaceEnroll from './pages/auth/signup/FaceEnroll.jsx';
import FaceVerify from './pages/auth/login/FaceVerify.jsx';
import { setUser, logout } from './redux/authSlice';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

function AppContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (user) => {
    dispatch(setUser(user));
    navigate('/face-verification');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Helper to parse query params for face-enroll route
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      reference: searchParams.get('reference'),
      email: searchParams.get('email'),
    };
  };

  const { reference, email } = getQueryParams();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/signup" element={
        <SignupPage onVerified={(reference, email) => {
          // After email verification, route to face enrollment and pass details
          navigate(`/face-enroll?reference=${reference}&email=${encodeURIComponent(email)}`);
        }} />
      } />
      <Route path="/face-enroll" element={<FaceEnroll reference={reference} email={email} />} />
      <Route path="/face-verification" element={<FaceVerify />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
