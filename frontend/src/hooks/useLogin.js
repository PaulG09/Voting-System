import { useState } from 'react';
import { login } from '../services/authService';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (reference, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await login(reference, password);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  return { handleLogin, loading, error };
};

export default useLogin;
