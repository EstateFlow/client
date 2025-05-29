import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useUserStore } from "@/store/userStore";

export const Route = createFileRoute("/protected")({
  component: ProtectedRoute,
});

function ProtectedRoute() {
  const { user } = useUserStore();

  if (!user) {
    return <Navigate to="/login-form" />;
  }

  return <Outlet />;
}
