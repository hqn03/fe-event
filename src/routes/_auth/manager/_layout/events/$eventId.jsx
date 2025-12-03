import SeatMapCreate from "@/components/seat-map-creat";
import SessionForm from "@/components/session-form";
import TicketForm from "@/components/ticket-form";
import { getEvent } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/manager/_layout/events/$eventId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { eventId } = useParams({
    from: "/_auth/manager/_layout/events/$eventId",
  });
  const { type } = useSearch({
    from: "/_auth/manager/_layout/events/$eventId",
  });
  const { data: event = {} } = useQuery({
    queryKey: ["event-detail"],
    queryFn: () => getEvent({ id: eventId }),
  });

  switch (type) {
    case "tickets":
      return <TicketForm event={event} />;
    case "seats":
      return <SeatMapCreate seatData={event.ghes} />;
    case "sessions":
      return <SessionForm event={event} />;
    default:
      return <div>NOT FOUND</div>;
  }

  // return <h1>COntent</h1>;
}
