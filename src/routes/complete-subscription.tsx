import CompleteSubscriptionPage from "@/pages/CancelSubscriptionPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/complete-subscription")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CompleteSubscriptionPage />;
}
