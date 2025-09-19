// src/services/api.ts
import axios from "axios";

const API_BASE =  "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

let refresh = false;

// Intercepteur pour ajouter token si présent dans localStorage (ou Pinia)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ou utilise Pinia
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
