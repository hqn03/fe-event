import Preview from "@/components/seat-map/Preview";
import TicketBooking from "@/components/ticket-booking";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
  const [allowFetch, setAllowFetch] = useState(false);
  const navigate = useNavigate({});

  const orderQuery = useQuery({
    queryKey: [],
    queryFn: () =>
      api.get(`/sessions/${session}/order`).then((res) => res.data),
    gcTime: 0,
  });

  useEffect(() => {
    if (orderQuery.isSuccess) {
      if (orderQuery.data) {
        const ok = window.confirm("Bạn có đơn hàng chưa hoàn tất, tiếp tục?");
        if (ok) {
          navigate({
            to: "/orders/$id/payment",
            params: {
              id: orderQuery.data.ma_don_hang,
            },
          });
        } else {
          api
            .delete(`/orders/${orderQuery.data.ma_don_hang}`)
            .then(({ data }) => {
              setAllowFetch(true);
              console.log(data);
            });
        }
      } else {
        setAllowFetch(true);
      }
    }
  }, [orderQuery.isLoading]);

  const seatsQuery = useQuery({
    queryKey: ["seats", event],
    queryFn: () => api.get(`/events/${event}/seats`).then((res) => res.data),
    enabled: allowFetch,
  });

  const orderedSeatsQuery = useQuery({
    queryKey: ["ordered-seats", session],
    queryFn: () =>
      api.get(`/sessions/${session}/ordered-seats`).then((res) => res.data),
    enabled: allowFetch,
  });

  const ticketsQuery = useQuery({
    queryKey: ["tickets", session],
    queryFn: () => api.get(`/sessions/${session}`).then((res) => res.data),
    enabled: allowFetch,
  });

  if (orderQuery.isLoading) {
    return <div>Đang kiểm tra đơn hàng...</div>;
  }

  if (allowFetch && seatsQuery.isLoading) {
    return <div>Đang tải sơ đồ ghế...</div>;
  }

  const seats = seatsQuery.data ?? [];
  const orderedSeats = orderedSeatsQuery.data ?? [];
  const tickets = ticketsQuery.data;

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
        <Preview seatData={seatData} orderedData={orderedSeatsQuery.data} />
      </div>
    );

  return (
    <div>
      <TicketBooking tickets={tickets?.loaiVes} />
    </div>
  );
}

// const { data: seats, isLoading } = useQuery({
//   queryKey: ["seats"],
//   queryFn: () => api.get(`/events/${event}/seats`).then((data) => data.data),
// });
// const { data: orderedSeats } = useQuery({
//   queryKey: ["ordered-seats"],
//   queryFn: () =>
//     api.get(`/sessions/${session}/ordered-seats`).then((data) => data.data),
// });
// const { data: test } = useQuery({
//   queryKey: ["tickets"],
//   queryFn: () => api.get(`/sessions/${session}`).then((res) => res.data),
// });

// console.log(test2);

// if (isLoading) return <div>Loading...</div>;
