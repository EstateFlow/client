import { createFileRoute } from '@tanstack/react-router'
import LogInPage from '@/pages/LogInPage'; 

export const Route = createFileRoute('/loginForm')({
  component: () => <LogInPage/>,
});