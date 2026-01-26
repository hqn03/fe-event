import HeroSection from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { getClientEvents } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["client-events"],
    queryFn: getClientEvents,
  });

  if (isLoading) return <div>Loading...</div>;

  const dataHero = events[0].suKiens;

  return (
    <div>
      <HeroSection data={dataHero} />
      {events.map((eventTypes) => {
        const { loai_su_kien, duong_dan, suKiens } = eventTypes;
        if (suKiens.length > 0)
          return (
            <div key={loai_su_kien} className="mt-4">
              <div className="flex mb-4">
                <div className="flex-1 text-lg font-medium">{loai_su_kien}</div>
                <Link from="/" to={"search"} search={{ type: duong_dan }}>
                  <Button variant={"link"} className={"cursor-pointer"}>
                    Xem thêm <ChevronRight />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-8">
                {suKiens.map((event) => (
                  <Link
                    to={`/${event.duong_dan}`}
                    className=""
                    key={event.ma_su_kien}
                  >
                    <img className="rounded-lg" src={event.hinh_anh} />
                    <div className="flex flex-col h-20 gap-2 mt-4">
                      <span className="flex-1 w-fit block line-clamp-2 font-semibold">
                        {event.ten_su_kien}
                      </span>
                      <span>{format(event.ngay_bat_dau, "dd/MM/yyyy")}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
      })}
    </div>
  );
}
