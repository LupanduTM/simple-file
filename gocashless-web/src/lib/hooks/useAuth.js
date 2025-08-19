
import { useState, useEffect } from 'react';

// A simple hook to manage auth state
// You would integrate this with your state management (e.g., Zustand)
export default function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    if (storedToken) {
      setToken(storedToken);
      // In a real app, you would decode the token to get user info
      setUser({ name: 'Bus Company Owner' });
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem('jwt_token', newToken);
    setToken(newToken);
    setUser({ name: 'Bus Company Owner' });
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setUser(null);
  };

  return { user, token, login, logout };
}
