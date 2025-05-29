import { createFileRoute, useNavigate } from "@tanstack/react-router";
import UserDashboard from "@/pages/UserDashboardPage";
import { useUserStore } from "@/store/userStore";

// const offers = Array.from({ length: 4 }).map((_, i) => ({
//   id: String(i),
//   address: "Somewhere st. 12",
//   type: "rent",
//   price: 40000,
//   imageUrl: "https://surl.li/tsnybn"
// }));

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
