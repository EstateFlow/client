import { VerifyEmailPage } from "@/pages/VerifyEmailPage";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/verify-email/$email-token")({
  component: RouteComponent,
  loader: ({ params }) => {
    const emailToken = params["email-token"];
    return { emailToken };
  },
});

function RouteComponent() {
  const { emailToken } = useLoaderData({ from: "/verify-email/$email-token" });

  return <VerifyEmailPage emailToken={emailToken} />;
}
