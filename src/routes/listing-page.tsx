import { createFileRoute, useSearch } from "@tanstack/react-router";
import ListingPage from "@/pages/ListingPage";

export const Route = createFileRoute("/listing-page")({
  validateSearch: (search: Record<string, unknown>) => {
    if (typeof search.propertyId !== "string") {
      throw new Error("Missing or invalid 'propertyId'");
    }
    return {
      propertyId: search.propertyId,
    };
  },
  component: ListingRouteComponent,
});

function ListingRouteComponent() {
  const search = useSearch({ from: "/listing-page" });
  return <ListingPage propertyId={search.propertyId} />;
}
