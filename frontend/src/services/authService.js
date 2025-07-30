
import { BACKEND_URL } from '../utils/constants';
// authService.js
// Handles API calls related to authentication

export const login = async (reference, password) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, password })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    return await response.json();
  } catch (err) {
    throw new Error(err.message || 'Network error');
  }
};
