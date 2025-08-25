import invoke from "../utils/invoke";

// Get all parents with pagination
export const getAllParents = async (page = 1, limit = 20) => {
  const data = await invoke({
    url: `/admin/parents?page=${page}&limit=${limit}`,
    method: "GET",
  });
  return data;
};

// Get parent by ID with detailed information
export const getParentById = async (id) => {
  const data = await invoke({
    url: `/admin/parents/${id}`,
    method: "GET",
  });
  return data;
};
