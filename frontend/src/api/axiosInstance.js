// src/api/axiosInstance.js
import axios from "axios";

export const BASE_URL = "http://localhost:4000/api"; // your backend URL

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default API;
