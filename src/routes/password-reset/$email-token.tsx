import RestorePasswordStep2Page from "@/pages/RestorePasswordStep2Page";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/password-reset/$email-token")({
  component: RouteComponent,
  loader: ({ params }) => {
    const emailToken = params["email-token"];
    return { emailToken };
  },
});

function RouteComponent() {
  const { emailToken } = useLoaderData({
    from: "/password-reset/$email-token",
  });
  return <RestorePasswordStep2Page emailToken={emailToken} />;
}
