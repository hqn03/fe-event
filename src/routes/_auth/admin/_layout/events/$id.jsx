import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import api, { getClientEvent } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { format } from "date-fns";
import { ChevronsUpDown } from "lucide-react";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import ReactMarkdown from "react-markdown";
import { vi } from "date-fns/locale";
import { MapPin } from "lucide-react";
import { Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_auth/admin/_layout/events/$id")({
  component: RouteComponent,
});

function formatTimeRange(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // hh:mm - hh:mm, dd 'tháng' MM 'năm' yyyy
  const startHHMM = format(startDate, "HH:mm");
  const endHHMM = format(endDate, "HH:mm");
  const datePart = format(startDate, "dd 'tháng' MM 'năm' yyyy", {
    locale: vi,
  });

  return `${startHHMM} - ${endHHMM}, ${datePart}`;
}

function ChangeView({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords); // di chuyển map theo tọa độ mới
      map.invalidateSize(); // fix lỗi map chưa cập nhật
    }
  }, [coords, map]);

  return null;
}

function RouteComponent() {
  const navigate = useNavigate({});
  const { id } = useParams({});

  const { data: event, isLoading } = useQuery({
    queryKey: ["event"],
    queryFn: () => api.get(`manager/events/${id}`).then(({ data }) => data),
  });

  if (isLoading) return <div>Loading....</div>;

  console.log(event);
  return (
    <div className="grid grid-cols-12 px-8">
      <div className="relative col-span-12 h-96 overflow-hidden my-8">
        <img
          src={event.hinh_anh}
          className="relative h-full mx-auto shadow-xl z-10"
        />
        <img
          src={event.hinh_anh}
          className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 z-0"
        />
      </div>

      {/* Địa điểm */}
      <div className="col-span-8">
        <div>
          <div className="text-4xl font-bold mb-8">{event.ten_su_kien}</div>
          <div className="flex gap-2 items-center font-medium">
            <MapPin size={20} />
            {event.dia_diem}
          </div>
          <div className="flex gap-2 items-center font-medium">
            <Calendar size={20} />
            {format(event.ngay_bat_dau, "dd 'tháng' MM, yyyy")}
          </div>
        </div>

        <Separator className={"my-8"} />

        <div>
          <div className="text-xl font-semibold uppercase">Mô tả:</div>
          <ReactMarkdown>{event.mo_ta}</ReactMarkdown>
        </div>

        <Separator className={"my-8"} />

        <div className="rounded-lg overflow-hidden">
          <div className="bg-primary text-white p-4">Loại vé</div>
          {event.phienSuKiens.map((phien) => {
            return (
              <div key={phien.id_phien_su_kien}>
                <div className="flex items-center justify-between gap-4 p-4 bg-primary text-white">
                  <div className="flex-1 font-semibold">
                    {formatTimeRange(
                      phien.thoi_gian_bat_dau,
                      phien.thoi_gian_ket_thuc
                    )}
                  </div>
                </div>
                <div className="flex flex-col rounded-lg">
                  {phien.loaiVes.map((ve, index) => (
                    <div
                      key={ve.ten_loai_ve || ve.ten_ve}
                      className={`flex p-4 ${
                        index % 2 ? "bg-gray-300" : "bg-neutral-200"
                      }`}
                    >
                      <div className="flex-1">
                        {ve.ten_loai_ve || ve.ten_ve}
                      </div>
                      <div>
                        {ve.so_luong_con === 0 ? (
                          <span>HET VE</span>
                        ) : (
                          <span>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(ve.gia_ve)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <Separator className={"my-8"} />

        <div className="max-w-2/3 grid grid-cols-2 gap-8">
          <div>
            <div className="text-xl font-semibold mb-1 uppercase">Địa điểm</div>
            <span>{event.dia_diem}</span>
          </div>
          <MapContainer
            id="map"
            className="map rounded-b-lg! rounded-t-none!"
            center={[event.vi_do, event.kinh_do]}
            zoom={16}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[event.vi_do, event.kinh_do]} />
            <ChangeView coords={[event.vi_do, event.kinh_do]} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
