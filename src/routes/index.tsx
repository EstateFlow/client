import { createFileRoute } from "@tanstack/react-router";
import MainpageForm from "@/pages/MainPage"; 


export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
      <MainpageForm />
  );
}
