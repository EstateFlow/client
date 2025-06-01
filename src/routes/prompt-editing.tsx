import PromptEditingPage from "@/pages/PromptEditingPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/prompt-editing")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PromptEditingPage />;
}
