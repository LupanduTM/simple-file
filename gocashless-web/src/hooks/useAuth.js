
import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';

export const useAuth = () => {
  const {
    user,
    token,
    login,
    logout,
    initialize,
  } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    user: { name: 'Bus Company Owner' },
    token: 'fake-jwt-token',
    login,
    logout,
  };
};
