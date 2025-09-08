import { create } from "zustand";
import {
  getStats,
  getAllPaymentRequests,
  getPaymentRequestById,
  updatePaymentRequestStatus,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  getPendingOnboardUsers,
  getUserById,
  approveUserOnboarding,
} from "../api/admin";

export const useAdminStore = create((set, get) => ({
  // Stats data
  stats: null,
  
  // Payment requests data
  paymentRequests: [],
  selectedPaymentRequest: null,

  // Admins data
  admins: [],

  // Pending users data
  pendingUsers: [],
  pendingUsersPagination: null,

  // User detail data
  selectedUser: null,
  
  // Loading states
  isLoadingStats: false,
  isLoadingPaymentRequests: false,
  isUpdatingPaymentRequest: false,
  isLoadingAdmins: false,
  isCreatingAdmin: false,
  isDeletingAdmin: false,
  isLoadingPendingUsers: false,
  isLoadingUserDetail: false,
  isApprovingUser: false,

  // Error states
  error: null,
  statsError: null,
  paymentRequestsError: null,
  adminsError: null,
  pendingUsersError: null,
  userDetailError: null,
  approveUserError: null,

  // Fetch platform statistics
  fetchStats: async (days = null) => {
    set({ isLoadingStats: true, statsError: null });
    
    try {
      const response = await getStats(days);
    
      if (response.data && response.data.success) {
        set({
          stats: response.data.data,
          isLoadingStats: false,
        });
        return { success: true, data: response.data.data };
      } else {
        const errorMessage =
          response.data?.message || "Failed to fetch statistics";
        set({ statsError: errorMessage, isLoadingStats: false });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Fetch stats error:", error);
      let errorMessage = "Failed to fetch statistics";
      
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors[0]?.message || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      set({ statsError: errorMessage, isLoadingStats: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch all payment requests
  fetchPaymentRequests: async () => {
    set({ isLoadingPaymentRequests: true, paymentRequestsError: null });
    
    try {
      const response = await getAllPaymentRequests();
      
      if (response.data && response.data.success) {
        set({
          paymentRequests: response.data.data || [],
          isLoadingPaymentRequests: false,
        });
        return { success: true, data: response.data.data };
      } else {
        const errorMessage =
          response.data?.message || "Failed to fetch payment requests";
        set({
          paymentRequestsError: errorMessage,
          isLoadingPaymentRequests: false,
        });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Fetch payment requests error:", error);
      let errorMessage = "Failed to fetch payment requests";
      
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors[0]?.message || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      set({
        paymentRequestsError: errorMessage,
        isLoadingPaymentRequests: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch payment request by ID
  fetchPaymentRequestDetails: async (requestId) => {
    set({ isLoadingPaymentRequests: true, paymentRequestsError: null });
    
    try {
      const response = await getPaymentRequestById(requestId);
      
      if (response.data && response.data.success) {
        set({
          selectedPaymentRequest: response.data.data,
          isLoadingPaymentRequests: false,
        });
        return { success: true, data: response.data.data };
      } else {
        const errorMessage =
          response.data?.message || "Failed to fetch payment request details";
        set({
          paymentRequestsError: errorMessage,
          isLoadingPaymentRequests: false,
        });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Fetch payment request details error:", error);
      let errorMessage = "Failed to fetch payment request details";
      
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors[0]?.message || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      set({
        paymentRequestsError: errorMessage,
        isLoadingPaymentRequests: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Update payment request status
  updatePaymentStatus: async (requestId, status) => {
    set({ isUpdatingPaymentRequest: true, paymentRequestsError: null });
    
    try {
      const response = await updatePaymentRequestStatus(requestId, status);
      
      if (response.data && response.data.success) {
        // Update the payment request in the list
        const updatedRequests = get().paymentRequests.map((request) =>
          request.id === requestId 
            ? {
                ...request,
                status: status,
                updatedAt: new Date().toISOString(),
              }
            : request
        );
        
        // Update selected payment request if it's the one being updated
        const selectedRequest = get().selectedPaymentRequest;
        const updatedSelectedRequest =
          selectedRequest?.id === requestId
            ? {
                ...selectedRequest,
                status: status,
                updatedAt: new Date().toISOString(),
              }
          : selectedRequest;
        
        set({
          paymentRequests: updatedRequests,
          selectedPaymentRequest: updatedSelectedRequest,
          isUpdatingPaymentRequest: false,
        });
        
        return { success: true, data: response.data.data };
      } else {
        const errorMessage =
          response.data?.message || "Failed to update payment request status";
        set({
          paymentRequestsError: errorMessage,
          isUpdatingPaymentRequest: false,
        });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Update payment request status error:", error);
      let errorMessage = "Failed to update payment request status";

      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors[0]?.message || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      set({
        paymentRequestsError: errorMessage,
        isUpdatingPaymentRequest: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch all admins
  fetchAdmins: async () => {
    set({ isLoadingAdmins: true, adminsError: null });

    try {
      const response = await getAllAdmins();

      if (response.data && response.data.success) {
        set({
          admins: response.data.data.items || [],
          isLoadingAdmins: false,
        });
        return { success: true, data: response.data.data.items };
      } else {
        const errorMessage = response.data?.message || "Failed to fetch admins";
        set({ adminsError: errorMessage, isLoadingAdmins: false });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Fetch admins error:", error);
      let errorMessage = "Failed to fetch admins";

      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors[0]?.message || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      set({ adminsError: errorMessage, isLoadingAdmins: false });
      return { success: false, error: errorMessage };
    }
  },

  // Create new admin
  createNewAdmin: async (fullName, email, password) => {
    set({ isCreatingAdmin: true, adminsError: null });

    try {
      const response = await createAdmin(fullName, email, password);

      if (response.data && response.data.success) {
        // Add the new admin to the list
        const newAdmin = response.data.data;
        const updatedAdmins = [...get().admins, newAdmin];

        set({
          admins: updatedAdmins,
          isCreatingAdmin: false,
        });

        return { success: true, data: newAdmin };
      } else {
        const errorMessage = response.data?.message || "Failed to create admin";
        set({ adminsError: errorMessage, isCreatingAdmin: false });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Create admin error:", error);
      let errorMessage = "Failed to create admin";

      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors[0]?.message || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      set({ adminsError: errorMessage, isCreatingAdmin: false });
      return { success: false, error: errorMessage };
    }
  },

  // Delete admin
  deleteAdminById: async (id) => {
    set({ isDeletingAdmin: true, adminsError: null });
    try {
      const response = await deleteAdmin(id);
      if (response.data && response.data.success) {
        const updatedAdmins = get().admins.filter((admin) => admin.id !== id);
        set({ 
          admins: updatedAdmins,
          isDeletingAdmin: false 
        });
        return { success: true, data: response.data.data };
      } else {
        const errorMessage = response.data?.message || "Failed to delete admin";
        set({ adminsError: errorMessage, isDeletingAdmin: false });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Delete admin error:", error);
      let errorMessage = "Failed to delete admin";
      
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors[0]?.message || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      set({ adminsError: errorMessage, isDeletingAdmin: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch pending onboard users
  fetchPendingUsers: async (page = 1, limit = 10) => {
    set({ isLoadingPendingUsers: true, pendingUsersError: null });

    try {
      const response = await getPendingOnboardUsers(page, limit);

      if (response.data && response.data.success) {
        set({
          pendingUsers: response.data.data.items || [],
          pendingUsersPagination: response.data.data.pagination || null,
          isLoadingPendingUsers: false,
        });
        return { success: true, data: response.data.data };
      } else {
        const errorMessage =
          response.data?.message || "Failed to fetch pending users";
        set({ pendingUsersError: errorMessage, isLoadingPendingUsers: false });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Fetch pending users error:", error);
      let errorMessage = "Failed to fetch pending users";

      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors[0]?.message || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      set({ pendingUsersError: errorMessage, isLoadingPendingUsers: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch user detail by ID
  fetchUserDetail: async (userId) => {
    set({ isLoadingUserDetail: true, userDetailError: null });

    try {
      const response = await getUserById(userId);

      if (response.data && response.data.success) {
        set({
          selectedUser: response.data.data || null,
          isLoadingUserDetail: false,
        });
        return { success: true, data: response.data.data };
      } else {
        const errorMessage =
          response.data?.message || "Failed to fetch user details";
        set({ userDetailError: errorMessage, isLoadingUserDetail: false });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Fetch user detail error:", error);
      let errorMessage = "Failed to fetch user details";

      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors[0]?.message || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      set({ userDetailError: errorMessage, isLoadingUserDetail: false });
      return { success: false, error: errorMessage };
    }
  },

  // Approve user onboarding
  approveUser: async (userId) => {
    set({ isApprovingUser: true, approveUserError: null });

    try {
      const response = await approveUserOnboarding(userId);

      if (response.data && response.data.success) {
        set({ isApprovingUser: false });
        return { success: true, data: response.data };
      } else {
        const errorMessage =
          response.data?.message || "Failed to approve user";
        set({ approveUserError: errorMessage, isApprovingUser: false });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Approve user error:", error);
      let errorMessage = "Failed to approve user";

      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors[0]?.message || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      set({ approveUserError: errorMessage, isApprovingUser: false });
      return { success: false, error: errorMessage };
    }
  },

  // Manual setters
  setStats: (stats) => set({ stats }),
  setPaymentRequests: (paymentRequests) => set({ paymentRequests }),
  setSelectedPaymentRequest: (request) =>
    set({ selectedPaymentRequest: request }),
  setAdmins: (admins) => set({ admins }),
  setPendingUsers: (pendingUsers) => set({ pendingUsers }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  // Clear selected items
  clearSelectedPaymentRequest: () => set({ selectedPaymentRequest: null }),
  clearSelectedUser: () => set({ selectedUser: null }),

  // Error helpers
  setError: (error) => set({ error }),
  setStatsError: (error) => set({ statsError: error }),
  setPaymentRequestsError: (error) => set({ paymentRequestsError: error }),
  setAdminsError: (error) => set({ adminsError: error }),
  setPendingUsersError: (error) => set({ pendingUsersError: error }),
  setUserDetailError: (error) => set({ userDetailError: error }),
  setApproveUserError: (error) => set({ approveUserError: error }),
  clearErrors: () =>
    set({
      error: null,
      statsError: null,
      paymentRequestsError: null,
      adminsError: null,
      pendingUsersError: null,
      userDetailError: null,
      approveUserError: null,
    }),

  // Clear all data
  clearAll: () =>
    set({
      stats: null,
      paymentRequests: [],
      selectedPaymentRequest: null,
      admins: [],
      pendingUsers: [],
      pendingUsersPagination: null,
      selectedUser: null,
      error: null,
      statsError: null,
      paymentRequestsError: null,
      adminsError: null,
      pendingUsersError: null,
      userDetailError: null,
      approveUserError: null,
    }),

  // Get payment request status options
  getPaymentStatusOptions: () => [
    { value: "PENDING", label: "Pending", color: "#ffc107" },
    { value: "REQUESTED", label: "Requested", color: "#17a2b8" },
    { value: "IN_REVIEW", label: "In Review", color: "#fd7e14" },
    { value: "PAID", label: "Paid", color: "#28a745" },
    { value: "REJECTED", label: "Rejected", color: "#dc3545" },
  ],

  // Get stats summary (helper for dashboard)
  getStatsSummary: () => {
    const { stats } = get();
    if (!stats) return null;
    
    return [
      {
        title: "Total Users",
        value: stats.totalUsers || 0,
        icon: "👥",
        color: "#1976d2",
      },
      {
        title: "Total Parents",
        value: stats.totalParents || 0,
        icon: "👨‍👩‍👧‍👦",
        color: "#2e7d32",
      },
      {
        title: "Total Tutors",
        value: stats.totalTutors || 0,
        icon: "👨‍🏫",
        color: "#ed6c02",
      },
      {
        title: "Total Revenue",
        value: `$${stats.totalRevenue?.toFixed(2) || "0.00"}`,
        icon: "💰",
        color: "#9c27b0",
      },
      {
        title: "Total Subscriptions",
        value: stats.totalSubscriptions || 0,
        icon: "📋",
        color: "#f57c00",
      },
      {
        title: "Total Transactions",
        value: stats.totalTransactions || 0,
        icon: "💳",
        color: "#00695c",
      },
    ];
  },
}));
