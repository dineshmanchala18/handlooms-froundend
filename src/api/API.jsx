import axios from "axios";

const DEFAULT_API_URL = import.meta.env.DEV ? "/api" : "http://localhost:8081";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || DEFAULT_API_URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
