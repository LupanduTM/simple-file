
import { create } from 'zustand';

// You might need to run: npm install zustand
// A simple store for managing authentication state
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: (token) => {
    // In a real app, you'd decode the token for user info
    set({ token, user: { name: 'Bus Company Owner' } });
    localStorage.setItem('jwt_token', token);
  },
  logout: () => {
    set({ token: null, user: null });
    localStorage.removeItem('jwt_token');
  },
  initialize: () => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      set({ token, user: { name: 'Bus Company Owner' } });
    }
  }
}));

export default useAuthStore;
