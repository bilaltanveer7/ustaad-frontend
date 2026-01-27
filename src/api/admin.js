import invoke from "../utils/invoke";

// Login function
export const login = async (loginData) => {
  const data = await invoke({
    url: `/auth/user-signin`,
    method: "POST",
    data: loginData,
  });
  return data;
};

// Get platform statistics
export const getStats = async (days = null) => {
  const url = days ? `/admin/stats?days=${days}` : `/admin/stats`;
  const data = await invoke({
    url: url,
    method: "GET",
  });
  return data;
};

// Get all payment requests
export const getAllPaymentRequests = async () => {
  const data = await invoke({
    url: `/admin/payment-requests`,
    method: "GET",
  });
  return data;
};

// Get payment request by ID
export const getPaymentRequestById = async (id) => {
  const data = await invoke({
    url: `/admin/payment-requests/${id}`,
    method: "GET",
  });
  return data;
};

// Update payment request status
export const updatePaymentRequestStatus = async (id, status) => {
  const data = await invoke({
    url: `/admin/payment-requests`,
    method: "PUT",
    data: { id, status },
  });
  return data;
};

export const createAdmin = async (firstName, lastName, email, password) => {
  const data = await invoke({
    url: `/admin/users/create`,
    method: "POST",
    data: { firstName, lastName, email, password },
  });
  return data;
};
export const getAllAdmins = async () => {
  const data = await invoke({
    url: `/admin/users/admins`,
    method: "GET",
  });
  return data;
};
export const deleteAdmin = async (id) => {
  const data = await invoke({
    url: `/admin/users/admins`,
    method: "DELETE",
    data: { id },
  });
  return data;
};

export const getPendingOnboardUsers = async (page = 1, limit = 10) => {
  const data = await invoke({
    url: `/admin/users/pending-onboard?page=${page}&limit=${limit}`,
    method: "GET",
  });
  return data;
};

export const getUserById = async (userId) => {
  const data = await invoke({
    url: `/admin/users/${userId}`,
    method: "GET",
  });
  return data;
};

export const getUserDataById = async (userId) => {
  const data = await invoke({
    url: `/admin/users/data/${userId}`,
    method: "GET",
  });
  return data;
};

export const approveUserOnboarding = async (userId) => {
  const data = await invoke({
    url: `/admin/users/approve-onboarding`,
    method: "PUT",
    data: { userId },
  });
  return data;
};
