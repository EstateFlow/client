import { createFileRoute } from "@tanstack/react-router";
import UserManagementPage from "@/components/UserManagementPage";

export const Route = createFileRoute("/user-management")({
  component: () => <UserManagementPage />,
});
