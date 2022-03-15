import axios from "axios";

let baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("access_token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export default instance;
