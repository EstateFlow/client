import PropertyManagementPage from "@/components/PropertyManagementPage";
import { useUserStore } from "@/store/userStore";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/property-management")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  if (user && user.role === "moderator") {
    return <PropertyManagementPage />;
  } else {
    navigate({ to: "/" });
  }
}
