import axios from "axios";

const API = axios.create({
  baseURL: "https://usersbackend-34t9.onrender.com/api"
});

// Attach token from localStorage
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
