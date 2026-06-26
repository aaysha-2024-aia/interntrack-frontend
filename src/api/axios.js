import axios from "axios";

// Create API instance with production backend URL
const API = axios.create({
  baseURL: "https://interntrack-backend-production-96fa.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle common errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;