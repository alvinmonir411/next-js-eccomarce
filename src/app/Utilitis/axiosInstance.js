// utils/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
});

let getToken = null;
export const attachTokenGetter = (fn) => (getToken = fn);

api.interceptors.request.use(
  async (config) => {
    if (getToken) {
      try {
        const token = await getToken();
        console.log(token);
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch (err) {
        console.error("Axios token error:", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
