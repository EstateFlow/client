import { createFileRoute } from '@tanstack/react-router'
import RegisterForm from '@/pages/RegisterFormPage'
export const Route = createFileRoute('/register-form')({
  component: () =><RegisterForm/>,
})