import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/services/api";
import { createFileRoute } from "@tanstack/react-router";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/_layout/ticket-scanner")({
  component: RouteComponent,
});

const status = new Map([
  ["CHUA_CHECK_IN", { label: "Chưa check in", color: "bg-green-800" }],
  ["CHECKED_IN", { label: "Đã checkin", color: "bg-amber-600" }],
  ["EXPIRED", { label: "Hết hạn", color: "bg-red-500" }],
  ["USED", { label: "Đã sử dụng", color: "bg-red-500" }],
]);

function RouteComponent() {
  const [active, setActive] = useState(true);
  // const [status, setStatus] = useState(null);
  const [ticket, setTicket] = useState(null);

  const handleScan = (result) => {
    if (!result || result.length === 0) return;

    const { rawValue } = result[0];
    const idTicket = rawValue.match(/id=([^&]+)/)[1];
    // const test = api.console.log(idTicket);

    api.get(`/tickets/${idTicket}`).then(({ data }) => setTicket(data));
  };

  const handleCheckin = () => {
    console.log(ticket);
    api
      .put(`/tickets/${ticket.id_ve}`, {
        status: "CHECKED_IN",
      })
      .then(({ data }) => {
        setTicket(data);
        toast.success("Cập nhật thành công", { position: "top-center" });
      });
  };

  const handleRollBack = () => {
    api
      .put(`/tickets/${ticket.id_ve}`, {
        status: "CHUA_CHECK_IN",
      })
      .then(({ data }) => {
        setTicket(data);
        toast.success("Cập nhật thành công", { position: "top-center" });
      });
  };

  const checkinDisable = ["CHECKED_IN", "EXPIRED", "USED"].includes(
    ticket?.trang_thai
  );
  const rollbackDisable = ticket?.trang_thai !== "CHECKED_IN";

  return (
    <div className="grid grid-cols-3 px-32 py-16">
      <div className="max-w-[500px]">
        {active && (
          <Scanner
            constraints={{ facingMode: "environment" }}
            scanDelay={1000}
            onScan={handleScan}
            onError={(error) => console.log(error?.message)}
          />
        )}
      </div>

      <Card className={"col-span-2"}>
        {/* Header */}
        <CardHeader className="mb-6">
          <CardTitle className="text-xl">Thông tin vé</CardTitle>
          <CardDescription>Dữ liệu được cập nhật sau khi quét</CardDescription>
          <CardContent>
            {ticket && (
              <div className="space-y-4">
                {/* Tên sự kiện */}
                <div className="pb-3 border-b text-xl font-semibold text-gray-800">
                  {ticket.ten_su_kien}
                </div>

                {/* Grid thông tin */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-500 text-sm">Địa điểm</div>
                    <div className="font-medium">{ticket.dia_diem}</div>
                  </div>

                  <div>
                    <div className="text-gray-500 text-sm">Thời gian</div>
                    <div className="font-medium">{ticket.thoi_gian}</div>
                  </div>

                  <div>
                    <div className="text-gray-500 text-sm">Loại vé</div>
                    <div className="font-medium">{ticket.ten_loai_ve}</div>
                  </div>

                  <div>
                    <div className="text-gray-500 text-sm">Ghế</div>
                    <div className="font-medium">
                      {ticket.ma_ghe || "Không"}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500 text-sm">Giá</div>
                    <div className="font-medium">
                      {ticket.gia.toLocaleString()}₫
                    </div>
                  </div>

                  {/* Trạng thái */}
                  <div>
                    <div className="text-gray-500 text-sm">Trạng thái</div>
                    <Badge
                      className={`text-sm ${status.get(ticket.trang_thai).color}`}
                    >
                      {status.get(ticket.trang_thai).label}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Nếu chưa quét */}
            {!ticket && (
              <div className="text-gray-500 text-center py-12">
                Hãy quét QR để xem thông tin vé...
              </div>
            )}
          </CardContent>
          <CardFooter className={"gap-4"}>
            {ticket && (
              <>
                <Button
                  variant={"outline"}
                  className={"flex-1"}
                  onClick={handleRollBack}
                  disabled={rollbackDisable}
                >
                  HOÀN TÁC
                </Button>
                <Button
                  className={"flex-1"}
                  onClick={handleCheckin}
                  disabled={checkinDisable}
                >
                  CHECKIN
                </Button>
              </>
            )}
          </CardFooter>
        </CardHeader>

        {/* Nếu có dữ liệu */}
      </Card>
    </div>
  );
}
