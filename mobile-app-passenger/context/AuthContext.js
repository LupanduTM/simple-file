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
          'X-Client-App': 'PASSENGER_MOBILE'
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

  const deleteUser = async () => {
    try {
      await userApiClient.delete('/api/v1/users/me');
      setUser(null);
    } catch (error) {
      console.error('Failed to delete account', error);
      throw error;
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await userApiClient.put('/api/v1/users/me', userData);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, deleteUser, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};