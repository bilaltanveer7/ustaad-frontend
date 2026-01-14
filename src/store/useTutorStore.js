import { create } from "zustand";
import { getAllTutors, getTutorById } from "../api/tutor";

export const useTutorStore = create((set, get) => ({
  tutors: [],
  selectedTutorId: null,
  selectedTutor: null,
  tutorDetails: null,
  pagination: null,
  filters: {
    search: "",
    subject: "all",
    status: "all",
  },
  isLoading: false,
  error: null,

  // Fetch all tutors with API
  fetchTutors: async (page = 1, limit = 20, search = "") => {
    set({ isLoading: true, error: null });

    try {
      const response = await getAllTutors(page, limit, search);

      if (response.data && response.data.success) {
        set({
          tutors: response.data.data.items,
          pagination: response.data.data.pagination,
          isLoading: false,
        });
        return { success: true, data: response.data.data };
      } else {
        const errorMessage = response.data?.message || "Failed to fetch tutors";
        set({ error: errorMessage, isLoading: false });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Fetch tutors error:", error);
      let errorMessage = "Failed to fetch tutors";

      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors[0]?.message || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch tutor details by ID
  fetchTutorDetails: async (tutorId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await getTutorById(tutorId);

      if (response.data && response.data.success) {
        set({
          tutorDetails: response.data.data,
          selectedTutor: response.data.data.tutor,
          selectedTutorId: tutorId,
          isLoading: false,
        });
        return { success: true, data: response.data.data };
      } else {
        const errorMessage =
          response.data?.message || "Failed to fetch tutor details";
        set({ error: errorMessage, isLoading: false });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Fetch tutor details error:", error);
      let errorMessage = "Failed to fetch tutor details";

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
  setTutors: (tutors) => set({ tutors }),
  addTutor: (tutor) => set((state) => ({ tutors: [tutor, ...state.tutors] })),
  updateTutor: (tutorId, partial) =>
    set((state) => ({
      tutors: state.tutors.map((t) =>
        t.id === tutorId ? { ...t, ...partial } : t
      ),
    })),
  removeTutor: (tutorId) =>
    set((state) => ({ tutors: state.tutors.filter((t) => t.id !== tutorId) })),

  // Selection methods
  selectTutor: (tutorId) => set({ selectedTutorId: tutorId }),
  clearSelectedTutor: () =>
    set({
      selectedTutorId: null,
      selectedTutor: null,
      tutorDetails: null,
    }),

  // Filter methods
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () =>
    set({ filters: { search: "", subject: "all", status: "all" } }),

  // Error and loading helpers
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Clear all data
  clearAll: () =>
    set({
      tutors: [],
      selectedTutorId: null,
      selectedTutor: null,
      tutorDetails: null,
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
