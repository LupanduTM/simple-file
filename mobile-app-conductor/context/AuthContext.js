import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // In a real app, you would fetch the user profile after login
  // For now, we'll simulate a logged-in user.
  useEffect(() => {
    // This is a mock user object. In a real app, you would get this
    // from a secure storage after the user logs in.
    setUser({
      id: 'd8a4f5a0-8b13-4b01-9f33-3b48c9b7f260', // This is a sample UUID
      username: 'conductor1',
      firstName: 'John',
      lastName: 'Doe',
      role: 'CONDUCTOR',
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
