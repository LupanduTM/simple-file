
import useAuthStore from '@/store/authStore';

export const useAuth = () => {
  const {
    user,
    token,
    loading,
    login,
    logout,
    setUser,
  } = useAuthStore();

  return {
    user,
    token,
    loading,
    login,
    logout,
    setUser,
  };
};
