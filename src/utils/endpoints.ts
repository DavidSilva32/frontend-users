const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "")

export const endpoints = {
  createUser: `${API_BASE}/user`,
  login: `${API_BASE}/login`,
  getProfile: `${API_BASE}/user/profile`,
  listAllUsers: `${API_BASE}/users`,
  getUserById: `${API_BASE}/user`,
  updateUser: `${API_BASE}/user`,
  deleteUser: `${API_BASE}/user`,
};