import CompletePaymentPage from "@/pages/CompletePaymentPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/complete-payment")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CompletePaymentPage />;
}
