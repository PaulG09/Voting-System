import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signup, verifyEmail } from '../../../services/emailVerificationService';

const Signup = ({ onVerified }) => {
  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await signup(reference, email);
      setSuccess('Verification code sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await verifyEmail(reference, code);
      setSuccess('Email verified!');
      if (onVerified) onVerified(reference, email);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
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
            <h1 className="login-title-main">Sign Up</h1>
            <h2 className="login-title-sub">Intelligent Voting System for UMaT-SRID</h2>
          </div>
          {step === 1 && (
            <form onSubmit={handleSignup} className="login-form">
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
                />
              </div>
              <div className="login-form-group">
                <label htmlFor="email" className="login-label">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="login-input"
                />
              </div>
              <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Sending...' : 'Send Verification Code'}</button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleVerify} className="login-form">
              <div className="login-form-group">
                <label htmlFor="code" className="login-label">Verification Code</label>
                <input
                  id="code"
                  type="text"
                  placeholder="Enter verification code"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  required
                  className="login-input"
                />
              </div>
              <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Verifying...' : 'Verify Email'}</button>
            </form>
          )}
          {error && <div className="login-error">{error}</div>}
          {success && <div style={{ color: 'green', marginTop: '0.5rem', textAlign: 'center' }}>{success}</div>}
          <div className="login-footer">
            <span>Already have an account? </span>
            <Link to="/" className="login-link">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
