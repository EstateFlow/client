import { createFileRoute } from '@tanstack/react-router'
import RegisterForm from '@/pages/RegisterForm'
export const Route = createFileRoute('/register-form')({
  component: () =><RegisterForm/>,
})