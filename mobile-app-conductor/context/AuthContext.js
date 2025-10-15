import React, { createContext, useState, useContext, useEffect } from 'react';
import userApiClient from '../services/userApiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const response = await userApiClient.get('/api/v1/users/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await userApiClient.post('/api/v1/auth/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Client-App': 'CONDUCTOR_MOBILE'
        }
      });
      setUser(response.data.user); 
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await userApiClient.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Failed to logout on server', error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};