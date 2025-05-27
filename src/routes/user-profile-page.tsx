import { createFileRoute, useSearch  } from '@tanstack/react-router'
import UserProfilePage from '@/pages/UserProfilePage';
export const Route = createFileRoute('/user-profile-page')({
validateSearch: (search: Record<string, unknown>) => {
  if (typeof search.userId !== 'string') {
    throw new Error("Missing or invalid 'userId' in search params");
  }
  return {
    userId: search.userId,
  };
},
  component: RouteComponent,
})

function RouteComponent() {
  const search = useSearch({ from: '/user-profile-page' });
  return <UserProfilePage userId= {search.userId} />
}
