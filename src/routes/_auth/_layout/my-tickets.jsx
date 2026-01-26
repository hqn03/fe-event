import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { formatVND } from "@/lib/utils";
import api from "@/services/api";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronsUpDown, Ticket } from "lucide-react";

export const Route = createFileRoute("/_auth/_layout/my-tickets")({
  component: RouteComponent,
});

function RouteComponent() {
  const myTicketsQuery = useQuery({
    queryKey: [],
    queryFn: () => api.get("/tickets").then((res) => res.data),
  });

  if (myTicketsQuery.isLoading) return <p>Đang tải ...</p>;

  return (
    <div className="m-auto p-6 flex justify-center">
      {myTicketsQuery.data.length === 0 ? (
        <div className="flex justify-center items-center h-[calc(100vh-100px)]">
          <div className="bg-white  text-center">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy vé</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {myTicketsQuery.data.map((i) => (
            <Collapsible
              key={i.ma_don_hang}
              className="max-w-[800px] bg-white border-2 rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
            >
              <CollapsibleTrigger asChild>
                <div className="p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-mono text-gray-500">
                          {i.ma_don_hang}
                        </span>
                        {/* <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[ve.status].color}`}>
                          {statusConfig[ve.status].label}
                        </span> */}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {i.ten_su_kien}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      {/* <Calendar className="w-4 h-4 text-purple-500" /> */}
                      <span>{i.thoi_gian}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      {/* <MapPin className="w-4 h-4 text-purple-500" /> */}
                      <span className="truncate">{i.dia_diem}</span>
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <div className=" p-6 font-semibold">Danh sách vé:</div>
              <CollapsibleContent className="flex flex-col gap-2">
                {i.ves.map((ve, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl overflow-hidden"
                  >
                    <Separator />
                    <div className="">
                      <div className="flex justify-between p-6">
                        <div className="flex space-x-4">
                          <div className="font-semibold">Tên loại vé: </div>
                          <p>{ve.ten_loai_ve}</p>
                        </div>

                        <div className="flex space-x-4">
                          <div className="font-semibold">Mã ghế</div>
                          <p>{ve.ma_ghe}</p>
                        </div>
                        <div className="flex space-x-4">
                          <div className="font-semibold">Giá vé</div>
                          <p>{formatVND(ve.don_gia)}</p>
                        </div>
                      </div>
                      <div className="size-40 m-auto">
                        <img src={ve.QR_code} />
                      </div>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}
