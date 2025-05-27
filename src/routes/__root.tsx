import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "@/components/Header";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner"

function RootComponent() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
      <Toaster richColors position="top-right" />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});