import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // In a real app, you would fetch the user profile after login
  // For now, we'll simulate a logged-in passenger user.
  useEffect(() => {
    setUser({
      id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // This is a sample passenger UUID
      username: 'passenger1',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'PASSENGER',
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
