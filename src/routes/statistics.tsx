import StatisticsPage from "@/pages/StatisticsPage";
import { useUserStore } from "@/store/userStore";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/statistics")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  if (user && user.role === "moderator") {
    return <StatisticsPage />;
  } else {
    navigate({ to: "/" });
  }
}
