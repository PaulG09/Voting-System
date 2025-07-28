import React from 'react';
import './App.css';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store';
import LoginPage from './pages/auth/login/Login.jsx';
import SignupPage from './pages/auth/signup/Signup.jsx';
import ImageVerificationPage from './pages/ImageVerificationPage.jsx';
import { setUser, logout } from './redux/authSlice';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function AppContent() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleLogin = (user) => {
    dispatch(setUser(user));
    navigate('/face-verification');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignupPage onVerified={(reference, email) => {
        // After email verification, route to face enrollment and pass details
        window.location.href = `/face-enroll?reference=${reference}&email=${encodeURIComponent(email)}`;
      }} />} />
      <Route path="/face-verification" element={isAuthenticated ? <ImageVerificationPage /> : <LoginPage onLogin={handleLogin} />} />
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
