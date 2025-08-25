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
    url: `/admin/payment-requests/status`,
    method: "PUT",
    data: { id, status },
  });
  return data;
};
