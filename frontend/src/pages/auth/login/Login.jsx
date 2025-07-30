import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useLogin from '../../../hooks/useLogin';
import './Login.css';

const Login = ({ onLogin }) => {

  const [reference, setReference] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, loading, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await handleLogin(reference, password);
    if (result && onLogin) {
      onLogin(result.user);
      // Redirect to face verification page with user reference in state
      navigate('/face-verification', { state: { userReference: reference } });
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card login-card-flex modern-shadow">
        <div className="login-side-logo">
          <img src={require('../../../assets/umat.png')} alt="UMaT Logo" className="login-side-img" />
          <div className="login-side-caption">UNIVERSITY OF MINES AND TECHNOLOGY<br />(UMaT)</div>
        </div>
        <div className="login-form-section">
          <div className="login-header">
            <h1 className="login-title-main">Welcome to</h1>
            <h2 className="login-title-sub">Intelligent Voting System for UMaT-SRID</h2>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="reference" className="login-label">Reference Number</label>
              <input
                id="reference"
                type="text"
                placeholder="Enter your reference number"
                value={reference}
                onChange={e => setReference(e.target.value)}
                required
                className="login-input"
                autoComplete="username"
              />
            </div>
            <div className="login-form-group">
              <label htmlFor="password" className="login-label">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="login-input"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        <div className="login-footer">
          <span>Don't have an account? </span>
          <Link to="/signup" className="login-link">Sign up</Link>
        </div>
          {error && <div className="login-error">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default Login;

