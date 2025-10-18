import axios from "../../utils/axiosInstance.js";

const user_EndPoint = "api/user";

// User Registration Function
const registerUser = async (userData) => {
  const formData = new FormData();
  formData.append("name", userData.name);
  formData.append("email", userData.email);
  formData.append("password", userData.password);
  formData.append("password2", userData.password2);
  formData.append("role", userData.role);
  formData.append("department", userData.department);
  formData.append("profilePicture", userData.profilePicture);

  try {
    const response = await axios.post(`/api/user/register`, formData, {
      headers: {},
    });

    return response.data;
  } catch (error) {
    console.log(error?.response?.data?.message || "Registration failed");
    throw error;
  }
};

// User Login Function
const loginUser = async (userData) => {
  const response = await axios.post(`${user_EndPoint}/login`, userData, {
    headers: {},
  });

  if (response.data && response.data.success && response.data.data) {
    localStorage.setItem("user", JSON.stringify(response.data.data));
  }

  return response.data;
};

// User Logout Function
const logoutUser = async () => {
  const response = await axios.post(`${user_EndPoint}/logout`);

  localStorage.removeItem("user");

  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  return response.data;
};

// Refreshing Access Token
const refreshAccessToken = async () => {
  const response = await axios.post(`/refresh-Token`);

  if (response.data && response.data.success && response.data.data) {
    localStorage.setItem("user", JSON.stringify(response.data.data));
  }

  return response.data;
};

// Update User Profile Function
async function updateUserProfile(updateData) {
  // Accepts plain object { name?, section?, semester?, session?, profilePicture? }
  const formData = new FormData();
  if (updateData.name !== undefined) formData.append("name", updateData.name);
  if (updateData.department !== undefined)
    formData.append("department", updateData.department);
  if (updateData.section !== undefined)
    formData.append("section", updateData.section);
  if (updateData.semester !== undefined)
    formData.append("semester", updateData.semester);
  if (updateData.session !== undefined)
    formData.append("session", updateData.session);
  if (updateData.profilePicture instanceof File) {
    formData.append("profilePicture", updateData.profilePicture);
  }

  const response = await axios.put(`/api/user/profile`, formData, {
    headers: {},
  });
  if (response.data && response.data.success && response.data.data) {
    localStorage.setItem("user", JSON.stringify(response.data.data));
  }
  return response.data;
}

export const userService = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateUserProfile,
};
