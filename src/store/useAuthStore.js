// Import the Zustand library
import { create } from "zustand";
import { login as loginAPI } from "../api/admin";

// Helper to load from localStorage safely
const loadFromLocalStorage = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const useAuthStore = create((set, get) => ({
  user: loadFromLocalStorage("auth_user", null),
  token: loadFromLocalStorage("auth_token", null),
  isAuthenticated: !!loadFromLocalStorage("auth_token", null),
  isLoading: false,
  error: null,

  // Set user data and token (internal function)
  setAuthData: ({ user, token }) => {
    window.localStorage.setItem("auth_user", JSON.stringify(user));
    window.localStorage.setItem("auth_token", JSON.stringify(token));
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },

  // Login function that calls API
  loginUser: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await loginAPI(credentials);
      // Check if login was successful
      if (response.data && response.data.success) {
        // Store login data
        get().setAuthData({
          user: response.data.data,
          token: response.data.data.token,
        });

        return {
          success: true,
          user: response.data.data,
          token: response.data.data.token,
        };
      } else {
        const errorMessage =
          response.data?.message || "Login failed. Please try again.";
        set({ error: errorMessage, isLoading: false });
        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage =
        "Login failed. Please check your connection and try again.";

      // Handle different types of errors
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (error.response?.status === 400) {
        errorMessage = "Please check your email and password";
      }

      set({ error: errorMessage, isLoading: false });
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  // Logout function
  logout: () => {
    window.localStorage.removeItem("auth_user");
    window.localStorage.removeItem("auth_token");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  // Update user data
  updateUser: (partialUser) => {
    const currentUser = get().user || {};
    const updatedUser = { ...currentUser, ...partialUser };
    window.localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  // Set loading state
  setLoading: (isLoading) => {
    set({ isLoading });
  },

  // Set error state
  setError: (error) => {
    set({ error });
  },

  // Clear error state
  clearError: () => {
    set({ error: null });
  },

  // Check if user has specific role
  hasRole: (role) => {
    const { user } = get();
    return user?.role === role || user?.roles?.includes(role);
  },

  // Get user permissions
  getPermissions: () => {
    const { user } = get();
    return user?.permissions || [];
  },

  // Initialize auth state (useful for app startup)
  initializeAuth: () => {
    const token = loadFromLocalStorage("auth_token", null);
    const user = loadFromLocalStorage("auth_user", null);

    if (token && user) {
      set({ user, token, isAuthenticated: true, isLoading: false });
    } else {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // Reset auth store to initial state
  resetAuthStore: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  // Check if current session is valid (can be enhanced with API call)
  validateSession: async () => {
    const { token, user } = get();

    if (!token || !user) {
      get().logout();
      return false;
    }

    // Can add API call here to validate token with backend
    // For now, just check if token exists
    return true;
  },

  // Get auth headers for manual API calls
  getAuthHeaders: () => {
    const { token } = get();
    if (!token) return {};

    return {
      Authorization: `Bearer ${token}`,
    };
  },
}));
