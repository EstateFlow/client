import CancelPaymentPage from "@/pages/CancelPaymentPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cancel-payment")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CancelPaymentPage />;
}
