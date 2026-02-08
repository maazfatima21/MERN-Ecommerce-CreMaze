import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// 🔐 AUTO LOGOUT ON TOKEN EXPIRY
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");

      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
