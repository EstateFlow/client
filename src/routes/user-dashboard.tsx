import { createFileRoute } from '@tanstack/react-router'
import UserDashboard from '@/pages/UserDashboardPage'
import { useAuthStore } from "@/store/auth";

// const offers = Array.from({ length: 4 }).map((_, i) => ({
//   id: String(i),
//   address: "Somewhere st. 12",
//   type: "rent",
//   price: 40000,
//   imageUrl: "https://surl.li/tsnybn"
// }));

function RouteComponent() {
  const user = useAuthStore((s) => s.user);

  return user
    ? <UserDashboard user={user as any} />
    : <div>Loading...</div>;
}

export const Route = createFileRoute('/user-dashboard')({
  component: RouteComponent,
});