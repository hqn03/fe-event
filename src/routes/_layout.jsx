import Header from "@/components/header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}
