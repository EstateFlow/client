import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/listings')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="p-2"> Listings</div>
};