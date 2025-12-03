import EventForm from "@/components/event-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/manager/_layout/events/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <EventForm />
    </div>
  );
}
