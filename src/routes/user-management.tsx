import { createFileRoute, useNavigate } from "@tanstack/react-router";
import UserManagementPage from "@/components/UserManagementPage";
import { useUserStore } from "@/store/userStore";

export const Route = createFileRoute("/user-management")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  if (user && user.role === "admin") {
    return <UserManagementPage />;
  } else {
    navigate({ to: "/" });
  }
}
