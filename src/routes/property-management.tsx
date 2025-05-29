import PropertyManagementPage from "@/components/PropertyManagementPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/property-management")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PropertyManagementPage />;
}
