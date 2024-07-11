import { Outlet, createRootRoute } from "@tanstack/react-router";

import { AuthProvider } from "@/components/AuthProvider";

import { TanStackRouterDevtools } from "@tanstack/router-devtools"

export const Route = createRootRoute({
  component: () => (
    <>
      <AuthProvider>
        <Outlet />
        <TanStackRouterDevtools />
      </AuthProvider>
    </>
  ),
});
