import { createFileRoute, useNavigate } from "@tanstack/react-router";
import UserDashboard from "@/pages/UserDashboardPage";
import { useUserStore } from "@/store/userStore";

function RouteComponent() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  if (user) {
    return <UserDashboard user={user as any} />;
  } else {
    navigate({ to: "/login-form" });
  }
}

export const Route = createFileRoute("/user-dashboard")({
  component: RouteComponent,
});
