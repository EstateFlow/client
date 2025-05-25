import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth";
import { login, fetchUser } from "@/api/auth";

export const useAuth = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user); // ⬅️ это ключевое
const loginUser = async (email: string, password: string) => {
  console.log("Start login...");
  const { data } = await login(email, password);
  console.log("Login success", data);
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  const userRes = await fetchUser();
  console.log("Fetched user", userRes.data);
  setUser(userRes.data);
  setTimeout(() => {
    navigate({ to: "/" });
  }, 10000);
};
  const checkAuth = async () => {
    try {
      const userRes = await fetchUser();
      setUser(userRes.data);
    } catch (err) {
      console.warn("Token invalid or expired, need login");
      useAuthStore.getState().logout();
    }
  };
  const isAuthenticated = !!user;
  return { loginUser, checkAuth, isAuthenticated};
};
