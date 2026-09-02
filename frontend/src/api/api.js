import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user.token) {
        config.headers.Authorization = `${user.type} ${user.token}`;
      }

      if (user.uuid) {
        config.headers["X-User-UUID"] = user.uuid;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;