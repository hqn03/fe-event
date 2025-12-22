import EventForm from "@/components/event-form";
import ManagerDashboardOrder from "@/components/manager-dashboard";
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
  const { data: event, isLoading } = useQuery({
    queryKey: ["event-detail"],
    queryFn: () => getEvent({ id: eventId }),
  });

  if (isLoading) return <p>Loading ...</p>;

  const dataFormEvent = {
    ma_su_kien: event.ma_su_kien,
    hinh_anh: event.hinh_anh,
    id_loai_su_kien: event.id_loai_su_kien,
    ten_su_kien: event.ten_su_kien,
    mo_ta: event.mo_ta,
    ngay_bat_dau: event.ngay_bat_dau,
    ngay_ket_thuc: event.ngay_ket_thuc,
    dia_diem: event.dia_diem,
    kinh_do: event.kinh_do,
    vi_do: event.vi_do,
  };

  switch (type) {
    case "tickets":
      return <TicketForm event={event} />;
    case "seats":
      return <SeatMapCreate seatData={event.ghes} />;
    case "sessions":
      return <SessionForm event={event} />;
    case "edit":
      return <EventForm initData={dataFormEvent} />;
    case "orders":
      return <ManagerDashboardOrder eventId={eventId} />;
    default:
      return <div></div>;
  }

  // return <h1>COntent</h1>;
}
