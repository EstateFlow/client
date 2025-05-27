import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "@/components/Header";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/authStore";
import { GoogleOAuthProvider } from "@react-oauth/google";

function RootComponent() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // перевірка при завантаженні
  }, [checkAuth]);

  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Header />
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools />
      </GoogleOAuthProvider>
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
