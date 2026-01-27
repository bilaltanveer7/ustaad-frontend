import invoke from "../utils/invoke";


export const login = async (loginData) => {
  const data = await invoke({
    url: `/auth/user-signin`,
    method: "POST",
    data: loginData,
  });
  return data;
};
