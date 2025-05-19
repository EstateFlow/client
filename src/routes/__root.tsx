import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header  from "@/components/ui/header";

export const Route = createRootRoute({

  component: () => (
    <>
      <Header>
        <Outlet />
      </Header>
    </>
  ),
});
