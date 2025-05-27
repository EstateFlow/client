import API from "./BaseUrl";
import type { UserInfo } from "@/lib/types";
// Inject token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 & refresh
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await API.post("/api/auth/refresh-token", {
          refreshToken,
        });
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return API(original);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  },
);

export const login = (email: string, password: string) =>
  API.post("/api/auth/login", { email, password });
export const fetchUser = () => API.get("/api/user");
export const fetchUserById = (userId: string) =>
  API.get<UserInfo>(`/api/user/${userId}`);

