import { createFileRoute } from "@tanstack/react-router";
import ListingsMainPage from "@/pages/ListingsMainPage";
export const Route = createFileRoute("/listings")({
  component: () => <ListingsMainPage />,
});
