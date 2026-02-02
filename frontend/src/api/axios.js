import axios from "axios";

export const API_BASE_URL = "http://localhost:5000/api";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
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
