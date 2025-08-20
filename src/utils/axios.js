// src/utils/axios.ts
import axios from "axios";

// 1️⃣ Definir la URL desde .env con fallback
const defaultApiUrl = import.meta.env.VITE_API_URL;

// 2️⃣ Usar localStorage solo si existe, si no, tomar de .env
const apiUrl = localStorage.getItem("api_url") || defaultApiUrl;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Interceptor para añadir token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(token ? JSON.parse(atob(token.split(".")[1])) : "no token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Interceptor para manejar token expirado o inválido
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
