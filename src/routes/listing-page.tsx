// src/routes/listing-page.tsx
import { createFileRoute, useSearch } from '@tanstack/react-router';
import ListingPage from '@/pages/ListingPage';

export const Route = createFileRoute('/listing-page')({
  validateSearch: (search: Record<string, unknown>) => {
    console.log("validateSearch called with:", search);
    if (typeof search.role !== 'string') {
      throw new Error("Missing or invalid 'role' in search params");
    }
    if (typeof search.propertyId !== 'string') {
    throw new Error("Missing or invalid 'propertyId'");
    }
    return {
      role: search.role,
      propertyId: search.propertyId,
    };
  },
  component: ListingRouteComponent,
});

function ListingRouteComponent() {
  const search = useSearch({ from: '/listing-page' });
  return <ListingPage role={search.role} propertyId = {search.propertyId}/>;
}
