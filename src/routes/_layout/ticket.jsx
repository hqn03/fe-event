import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/ticket")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useSearch({});
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["ticket"],
    queryFn: () => api.get(`tickets/${id}`).then(({ data }) => data),
    cacheTime: 0,
    staleTime: 0,
  });

  if (isLoading) return <div>loading...</div>;
  console.log(data);
  return (
    <div className="flex justify-center h-screen items-center    ">
      <Card className={"w-full md:max-w-[600px]"}>
        <CardHeader>
          <CardTitle>Thông tin vé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={"grid grid-cols-3 gap-4"}>
            <div className="col-span-3 md:col-span-1">
              <img src={data.QR_code} className="w-full" />
            </div>
            <div className="col-span-3 md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {data.su_kien.ten_su_kien}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                <strong>Địa điểm:</strong>
                <span className="block truncate">{data.su_kien.dia_diem}</span>
              </p>
              <p className="mt-2 text-sm text-gray-600">
                <strong>Thời gian:</strong>
                <span className="block truncate">{data.thoi_gian_bat_dau}</span>
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>
                  <div className="text-xs text-gray-500">Loại vé</div>
                  <div className="font-medium">Thường</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Mã vé</div>
                  <div className="font-mono text-sm break-all">
                    {data.id_ve}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Ghế</div>
                  <div>{data.ma_ghe || "Không có"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Ngày phát hành</div>
                  <div>{data.ngay_phat_hanh}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>

    // <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
    //   <div className="flex items-start gap-4 p-4">
    //     <div className="">
    //       <img
    //         src={data.QR_code}
    //         alt="QR code"
    //         className="w-28 h-28 rounded-md object-cover border"
    //       />
    //     </div>

    //     <div className="flex-1 min-w-0">
    //       <div className="flex items-center justify-between">
    //         <h2 className="text-lg font-semibold text-gray-900 truncate">
    //           [CAT&amp;MOUSE] CA SĨ VICKY NHUNG + CA SĨ PHAN DUY ANH
    //         </h2>
    //         {/* <span
    //           className="text-sm font-medium px-3 py-1 rounded-full
    //                  bg-yellow-100 text-yellow-800 border border-yellow-200"
    //         >
    //           CHƯA_CHECK_IN
    //         </span> */}
    //       </div>

    //       <p className="mt-2 text-sm text-gray-600">
    //         <strong>Địa điểm:</strong>
    //         <span className="block truncate">
    //           48 Cao Thắng, Phường Hải Châu, Thành phố Đà Nẵng
    //         </span>
    //       </p>

    //       <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
    //         <div>
    //           <div className="text-xs text-gray-500">Loại vé</div>
    //           <div className="font-medium">Thường</div>
    //         </div>

    //         <div>
    //           <div className="text-xs text-gray-500">Mã vé</div>
    //           <div className="font-mono text-sm break-all">
    //             gwCIr-0vJ2CKIvDReAp7C
    //           </div>
    //         </div>

    //         <div>
    //           <div className="text-xs text-gray-500">Ghế</div>
    //           <div>Không có</div>
    //         </div>

    //         <div>
    //           <div className="text-xs text-gray-500">Ngày phát hành</div>
    //           <div>12 Tháng 12, 2025 • 09:49</div>
    //         </div>

    //         <div className="col-span-2">
    //           <div className="text-xs text-gray-500">Thời gian</div>
    //           <div className="flex items-center gap-3">
    //             <div className="font-medium">Bắt đầu: 12/12/2025 • 20:00</div>
    //             <div className="text-gray-400">—</div>
    //             <div className="font-medium">Kết thúc: 12/12/2025 • 21:00</div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="bg-gray-50 px-4 py-3 flex items-center justify-between text-sm">
    //     <div className="text-gray-600">
    //       Vui lòng mang QR để quét khi đến sự kiện.
    //     </div>
    //     <div className="flex items-center gap-2">
    //       <button className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
    //         In vé
    //       </button>
    //       <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700">
    //         Chi tiết
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
}
