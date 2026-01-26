import PdfPreview from "@/components/pdf-preview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
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
import { useRef, useState } from "react";
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
  const [invoice, setInvoice] = useState(false);
  const [openInvoice, setOpenInvoive] = useState(false);

  const { data: datVe, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () =>
      api
        .get(`orders/${id}`)
        .then(({ data }) => data)
        .catch((error) => {
          alert(error.response.data);
          navigate({ from: "/", to: "/" });
        }),
  });

  if (isLoading) return <div>Loading...</div>;

  const { phienSuKien, nguoi_dat_ve, chiTietDatVes } = datVe;

  const handlePayment = async () => {
    if (invoice) {
      setOpenInvoive(true);
      return;
    }
    handleSubmit();
  };

  const handleSubmit = async () => {
    const { data } = await api.post("payment", {
      ma_don_hang: datVe.ma_don_hang,
      cong_thanh_toan: paymentMethod,
      so_tien: datVe.tong_tien,
      het_han: datVe.het_han,
      hoa_don: invoice,
    });

    window.location.href = data;
  };

  const handlePreviewPDF = async () => {
    const { data } = await api.get(`orders/${id}/pdf-preview`);
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
              <div>
                <span className="font-medium">Họ tên: </span>{" "}
                {nguoi_dat_ve.nguoi_dung.ho_ten}
              </div>
              <div>
                <span className="font-medium">Email: </span>
                {nguoi_dat_ve.nguoi_dung.email}
              </div>
              <div>
                <span className="font-medium">SDT: </span>
                {nguoi_dat_ve.nguoi_dung.so_dien_thoai}
              </div>
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
                navigate({ from: "/", to: "/" });
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
            <CardFooter className={"flex-wrap gap-4"}>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={invoice}
                  onCheckedChange={setInvoice}
                  id="invoice"
                />
                <Label htmlFor="invoice">Gửi kèm hóa đơn</Label>
              </div>
              <Button className={"w-full"} size={"lg"} onClick={handlePayment}>
                Thanh toán
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={openInvoice} onOpenChange={setOpenInvoive}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className={"min-w-3xl max-h-[90vh]"}>
          <DialogTitle>Xem trước hóa đơn</DialogTitle>
          <DialogDescription>
            <iframe
              src={`http://localhost:3000/api/orders/${id}/pdf-preview`}
              className="w-full h-[70vh]"
            />
          </DialogDescription>

          {/* <PdfPreview
                    url={`http://localhost:3000/api/orders/${id}/pdf-preview`}
                  /> */}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button onClick={handleSubmit}>Xác nhận thanh toán</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <PdfPreview url={`http://localhost:3000/api/orders/${id}/pdf-preview`} /> */}
    </div>
  );
}
