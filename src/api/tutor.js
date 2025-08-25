import invoke from "../utils/invoke";

// Get all tutors with pagination
export const getAllTutors = async (page = 1, limit = 20) => {
  const data = await invoke({
    url: `/admin/tutors?page=${page}&limit=${limit}`,
    method: "GET",
  });
  return data;
};

// Get tutor by ID with detailed information
export const getTutorById = async (id) => {
  const data = await invoke({
    url: `/admin/tutors/${id}`,
    method: "GET",
  });
  return data;
};
