import { createFileRoute, useSearch, useNavigate } from '@tanstack/react-router';
import ListingFormToAddPage from '@/pages/ListingFormToAddPage';
import { useUserStore } from "@/store/userStore";

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
    const { user } = useUserStore();
    const navigate = useNavigate();
  if(user && (user.role === "private_seller" || user.role === "agency")){
    const search = useSearch({ from: '/listing-form-to-add-page' });
    return <ListingFormToAddPage userId = {search.userId}/>;
  }else{
    navigate({ to: "/" });
  }

}