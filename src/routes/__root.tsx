import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "@/components/Header";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/authStore";

function RootComponent() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // перевірка при завантаженні
  }, [checkAuth]);

  return (
    <>
      <Header />
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
