import { getMe } from "@/services/api";
import { Outlet, redirect, useRouter } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context, location }) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    const user = await context.queryClient.ensureQueryData({
      queryKey: ["me"],
      queryFn: getMe,
    });

    if (!user)
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
