import { ConfirmChangePage } from "@/pages/ConfirmChangePage";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/confirm-change/$token/$type")({
  component: RouteComponent,
  loader: ({ params }) => {
    const token = params.token;
    const type = params.type;
    return { token, type };
  },
});

function RouteComponent() {
  const { token, type } = useLoaderData({
    from: "/confirm-change/$token/$type",
  });
  return <ConfirmChangePage token={token} type={type} />;
}
