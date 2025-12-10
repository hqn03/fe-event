import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";

const EventCard = ({ className, event, ...props }) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Link from="/" to={event.duong_dan}>
        <img className="rounded-lg" src={event.hinh_anh} />
        <div className="flex flex-col h-20 gap-2 mt-4">
          <span className="flex-1 w-fit block line-clamp-2 font-semibold">
            {event.ten_su_kien}
          </span>
          <span>{format(event.ngay_bat_dau, "dd/MM/yyyy")}</span>
        </div>
        {event.trang_thai === "KET_THUC" && (
          <span className="absolute top-0 right-0 bg-primary text-primary-foreground px-1 py-0.5">
            Sự kiện đã kết thúc
          </span>
        )}
      </Link>
    </div>
  );
};

export default EventCard;
