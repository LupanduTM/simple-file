
import { create } from 'zustand';
import apiClient from '../lib/api/apiClient';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: true,
  checkUser: async () => {
    try {
      const response = await apiClient.get('/api/v1/users/me');
      set({ user: response.data, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
    }
  },
  login: (token, user) => {
    set({ token, user });
  },
  logout: () => {
    set({ token: null, user: null });
  },
  setUser: (user) => {
    set({ user });
  },
}));

useAuthStore.getState().checkUser();

export default useAuthStore;
