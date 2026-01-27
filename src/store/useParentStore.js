import { create } from "zustand";
import { getAllParents, getParentById } from "../api/parent";

export const useParentStore = create((set, get) => ({
  parents: [],
  selectedParentId: null,
  selectedParent: null,
  parentDetails: null,
  pagination: null,
  filters: {
    search: "",
    status: "all",
  },
  isLoading: false,
  error: null,

  // Fetch all parents with API
  fetchParents: async (page = 1, limit = 20, search = "") => {
    set({ isLoading: true, error: null });

    try {
      const response = await getAllParents(page, limit, search);

      if (response.data && response.data.success) {
        set({
          parents: response.data.data.items,
          pagination: response.data.data.pagination,
          isLoading: false,
        });
        return { success: true, data: response.data.data };
      } else {
        const errorMessage =
          response.data?.message || "Failed to fetch parents";
        set({ error: errorMessage, isLoading: false });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Fetch parents error:", error);
      let errorMessage = "Failed to fetch parents";

      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors[0]?.message || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch parent details by ID
  fetchParentDetails: async (parentId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await getParentById(parentId);

      if (response.data && response.data.success) {
        set({
          parentDetails: response.data.data,
          selectedParent: response.data.data.parent,
          selectedParentId: parentId,
          isLoading: false,
        });
        return { success: true, data: response.data.data };
      } else {
        const errorMessage =
          response.data?.message || "Failed to fetch parent details";
        set({ error: errorMessage, isLoading: false });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Fetch parent details error:", error);
      let errorMessage = "Failed to fetch parent details";

      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors[0]?.message || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Manual setters (for backward compatibility)
  setParents: (parents) => set({ parents }),
  addParent: (parent) =>
    set((state) => ({ parents: [parent, ...state.parents] })),
  updateParent: (parentId, partial) =>
    set((state) => ({
      parents: state.parents.map((p) =>
        p.id === parentId ? { ...p, ...partial } : p
      ),
    })),
  removeParent: (parentId) =>
    set((state) => ({
      parents: state.parents.filter((p) => p.id !== parentId),
    })),

  // Selection methods
  selectParent: (parentId) => set({ selectedParentId: parentId }),
  clearSelectedParent: () =>
    set({
      selectedParentId: null,
      selectedParent: null,
      parentDetails: null,
    }),

  // Filter methods
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () => set({ filters: { search: "", status: "all" } }),

  // Error and loading helpers
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Clear all data
  clearAll: () =>
    set({
      parents: [],
      selectedParentId: null,
      selectedParent: null,
      parentDetails: null,
      pagination: null,
      error: null,
    }),

  // Async helpers (backward compatibility)
  withLoading: async (fn) => {
    try {
      set({ isLoading: true, error: null });
      await fn();
    } catch (err) {
      set({ error: err?.message || "Something went wrong" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
