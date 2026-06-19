import { create } from "zustand";
import api from "../lib/api";

const TOKEN_KEY = "psyckie_token";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem(TOKEN_KEY) || null,
  isInitializing: true,
  isLoading: false,
  error: null,
  async initialize() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ user: null, token: null, isInitializing: false });
      return false;
    }

    set({ isInitializing: true });

    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.user, token, isInitializing: false, error: null });
      return true;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      set({ user: null, token: null, isInitializing: false, error: null });
      return false;
    }
  },
  async login({ email, password }) {
    set({ isLoading: true, error: null });

    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      set({ user: data.user, token: data.token, isLoading: false, error: null });
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Login failed. Check your credentials.";
      set({ error: message, isLoading: false });
      return false;
    }
  },
  async signup({ fullName, email, password }) {
    set({ isLoading: true, error: null });

    try {
      const { data } = await api.post("/auth/signup", {
        fullName,
        email,
        password,
      });
      localStorage.setItem(TOKEN_KEY, data.token);
      set({ user: data.user, token: data.token, isLoading: false, error: null });
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Registration failed. Try again.";
      set({ error: message, isLoading: false });
      return false;
    }
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null, error: null });
  },
}));

export default useAuthStore;
