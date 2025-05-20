import { createFileRoute } from '@tanstack/react-router'
import ListingPage from '@/pages/ListingPage';
export const Route = createFileRoute('/listing-page')({
  component: () => <ListingPage/>,
})