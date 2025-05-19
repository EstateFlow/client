import { createFileRoute } from '@tanstack/react-router'
import RestorePasswordStep1Form from '@/pages/RestorePasswordStep1';

export const Route = createFileRoute('/restore-password-step1')({
  component: () => <RestorePasswordStep1Form/>,
});


