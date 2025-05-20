import { createFileRoute } from '@tanstack/react-router'
import RegisterForm from '@/pages/RegisterForm'
export const Route = createFileRoute('/register-form')({
  component: () =><RegisterForm/>,
})

function RouteComponent() {
  return <div>Hello "/register-form"!</div>
}
