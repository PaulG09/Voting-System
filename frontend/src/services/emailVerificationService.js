import { BACKEND_URL } from '../utils/constants';

export const signup = async (reference, email) => {
  const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference, email })
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Signup failed');
  return response.json();
};

export const verifyEmail = async (reference, code) => {
  const response = await fetch(`${BACKEND_URL}/api/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference, code })
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Verification failed');
  return response.json();
};

export const isVerified = async (reference) => {
  const response = await fetch(`${BACKEND_URL}/api/auth/is-verified/${reference}`);
  if (!response.ok) throw new Error('Check failed');
  return response.json();
};
