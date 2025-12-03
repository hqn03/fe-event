import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar, MapPin, Pin } from "lucide-react";
import { useState } from "react";
import Countdown from "react-countdown";

export const Route = createFileRoute("/_auth/_layout/orders/$id/payment")({
  component: RouteComponent,
});

const renderer = ({ minutes, seconds, completed }) => {
  // Render a countdown
  return (
    <span className="text-7xl text-red-600 m-auto font-semibold">
      {minutes}:{seconds}
    </span>
  );
};

function RouteComponent() {
  const { id } = useParams({});
  const navigate = useNavigate({});
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");

  const { data: datVe, isLoading } = useQuery({
    queryKey: ["order"],
    queryFn: () => api.get(`orders/${id}`).then(({ data }) => data),
  });

  console.log(datVe);
  if (isLoading) return <div>Loading...</div>;

  const { phienSuKien, nguoi_dat_ve, chiTietDatVes } = datVe;

  const handlePayment = async () => {
    const { data } = await api.post("payment", {
      ma_don_hang: datVe.ma_don_hang,
      cong_thanh_toan: paymentMethod,
      so_tien: datVe.tong_tien,
      het_han: datVe.het_han,
    });

    window.location.href = data;
  };

  return (
    <div className="px-32 my-8">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 space-y-4">
          {/* Thong tin su kien */}
          <Card>
            <CardHeader>
              <CardTitle className={"text-xl"}>
                {phienSuKien.su_kien.ten_su_kien}
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent>
              <div className="flex gap-2 items-center">
                <Calendar size={16} />
                {`${format(phienSuKien.thoi_gian_bat_dau, "HH:mm")} - ${format(phienSuKien.thoi_gian_ket_thuc, "HH:mm dd/MM/yyyy")}`}
              </div>
              <div className="flex gap-2 items-center">
                <MapPin size={16} />
                {phienSuKien.su_kien.dia_diem}
              </div>
            </CardContent>
          </Card>

          {/* Thong tin nguoi dat */}
          <Card>
            <CardHeader>
              <CardTitle className={"text-lg"}>Thông tin người đặt</CardTitle>
            </CardHeader>
            <CardContent>
              <div>{nguoi_dat_ve.nguoi_dung.ho_ten}</div>
              <div>{nguoi_dat_ve.nguoi_dung.email}</div>
              <div>{nguoi_dat_ve.nguoi_dung.so_dien_thoai}</div>
            </CardContent>
          </Card>

          {/* Thong tin nguoi dat */}
          <Card>
            <CardHeader>
              <CardTitle className={"text-lg"}>
                Phương thức thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                defaultValue={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="VNPAY" id="VNPAY" />
                  <Label htmlFor="VNPAY">VNPAY</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PAYOS" id="PAYOS" />
                  <Label htmlFor="PAYOS">PAYOS</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-4 space-y-4">
          <Card>
            <Countdown
              date={datVe.het_han}
              renderer={renderer}
              onComplete={() => {
                alert("Het thoi gian thanh toan, don hang se bi huy");
                navigate({
                  from: "",
                  to: "ticket-booking",
                  search: {
                    event: phienSuKien.su_kien.ma_su_kien,
                    session: datVe.id_phien_su_kien,
                  },
                });
              }}
            />
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đặt vé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between font-medium">
                <div>Loại vé</div>
                <div>Số lượng</div>
              </div>
              {chiTietDatVes.map((chiTiet) => (
                <div
                  key={chiTiet.id_chi_tiet}
                  className="text-sm leading-4 space-y-1 py-4 border-b border-dashed border-b-neutral-400"
                >
                  <div className="flex justify-between">
                    <div>{chiTiet.ten_loai_ve}</div>
                    <div>{chiTiet.so_luong}</div>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <div>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(chiTiet.don_gia)}
                    </div>
                    <div>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(chiTiet.thanh_tien)}
                    </div>
                  </div>
                  {chiTiet.ma_ghe && (
                    <span className="bg-primary text-white px-1">
                      {chiTiet.ma_ghe}
                    </span>
                  )}
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <div>Tổng cộng</div>
                <div>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(datVe.tong_tien)}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className={"flex-1"} size={"lg"} onClick={handlePayment}>
                Thanh toán
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
