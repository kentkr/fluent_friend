import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { refreshToken } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
});

// set default config info
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// handle logged out errors
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const success = await refreshToken()
      if (success) {
        const newToken = localStorage.getItem(ACCESS_TOKEN)
        if (newToken) {
          originalRequest.request.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }
      }
      // refresh failed
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api;
