import { createFileRoute } from '@tanstack/react-router'
import RestorePasswordStep2Form from '@/pages/RestorePasswordStep2Page';

export const Route = createFileRoute('/restore-password-step2')({
  component: () => <RestorePasswordStep2Form/>,
});


