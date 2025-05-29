import { createFileRoute, useSearch } from '@tanstack/react-router';
import ListingFormToAddPage from '@/pages/ListingFormToAddPage';

export const Route = createFileRoute('/listing-form-to-add-page')({
  validateSearch: (search: Record<string, unknown>) => {
    console.log("validateSearch called with:", search);
    if (typeof search.userId !== 'string') {
    throw new Error("Missing or invalid 'propertyId'");
    }
    return {
      userId: search.userId,
    };
  },
  component: ListingRouteComponent,
})

function ListingRouteComponent() {
  const search = useSearch({ from: '/listing-form-to-add-page' });
  return <ListingFormToAddPage userId = {search.userId}/>;
}