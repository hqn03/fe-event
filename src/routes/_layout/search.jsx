import EventCard from "@/components/event-card";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";

export const Route = createFileRoute("/_layout/search")({
  component: RouteComponent,
});

function RouteComponent() {
  const { q, type } = useSearch({});

  const { data: events, isLoading } = useQuery({
    initialData: [],
    queryKey: ["events-search", q, type],
    queryFn: () =>
      api.get(`events/search?q=${q}&type=${type}`).then(({ data }) => data),
  });

  if (isLoading) return <div>Loading ...</div>;

  console.log(events);
  return (
    <div className="grid grid-cols-12 gap-4 mt-6">
      {events.map((event) => (
        <EventCard
          key={event.ma_su_kien}
          className={"col-span-3"}
          event={event}
        />
      ))}
    </div>
  );
}
