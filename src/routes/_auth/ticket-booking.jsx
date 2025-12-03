import Preview from "@/components/seat-map/Preview";
import TicketBooking from "@/components/ticket-booking";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/ticket-booking")({
  beforeLoad: ({ context }) => {
    const { queryClient } = context;
    const user = queryClient.getQueryData(["me"]);
    if (user.role != "Khách hàng") {
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { event, session } = useSearch({ from: "/_auth/ticket-booking" });
  const { data: seats, isLoading } = useQuery({
    queryKey: ["seats"],
    queryFn: () => api.get(`/events/${event}/seats`).then((data) => data.data),
  });
  console.log(seats)
  const { data: orderedSeats } = useQuery({
    queryKey: ["ordered-seats"],
    queryFn: () =>
      api.get(`/sessions/${session}/ordered-seats`).then((data) => data.data),
  });
  const { data: test } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => api.get(`/sessions/${session}`).then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;

  const groupByRow = (seats) => {
    return seats.reduce((acc, seat) => {
      const currentRow = acc.get(seat.hang_ghe) || [];

      acc.set(seat.hang_ghe, [...currentRow, seat]);

      return acc;
    }, new Map());
  };

  const seatData = groupByRow(seats);

  if (seats.length !== 0)
    return (
      <div>
        <Preview seatData={seatData} orderedData={orderedSeats} />
      </div>
    );

  return (
    <div>
      <TicketBooking tickets={test?.loaiVes} />
    </div>
  );
}
