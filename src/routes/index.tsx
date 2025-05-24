import { createFileRoute } from "@tanstack/react-router";
import MainpageForm from "@/components/ui/mainpageForm"; 

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <MainpageForm />
    </div>
  );
}
