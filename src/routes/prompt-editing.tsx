import PromptEditingPage from "@/pages/PromptEditingPage";
import { useUserStore } from "@/store/userStore";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/prompt-editing")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  if (user && user.role === "admin") {
    return <PromptEditingPage />;
  } else {
    navigate({ to: "/" });
  }
}
