import axios from "axios";

// Backend URL
const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://interntrack-backend-production-96fa.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle common errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    if (!error.response) {
      console.error("Unable to connect to the backend server.");
    }

    return Promise.reject(error);
  }
);

export default API;