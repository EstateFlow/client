import { createFileRoute } from '@tanstack/react-router'
import AllListingsPage from '@/pages/AllListingsPage';
export const Route = createFileRoute('/listings')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AllListingsPage/>;
}