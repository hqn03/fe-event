import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/403")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <strong className="text-4xl">403 Access Forbidden</strong>
    </div>
  );
}
