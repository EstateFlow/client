import { createFileRoute } from "@tanstack/react-router";
import MainpageForm from "@/pages/MainPage";
import { useUserStore } from "@/store/userStore";
import PromptEditingPage from "@/pages/PromptEditingPage";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user } = useUserStore();
  return (
    <>
      {user && user.role === "admin" ? <PromptEditingPage /> : <MainpageForm />}
    </>
  );
}
