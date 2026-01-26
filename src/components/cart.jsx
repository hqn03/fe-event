import api from "@/services/api";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const Cart = ({ eventId, sessionId, items, setItems }) => {
  const navigate = useNavigate({});
  const handleCreateOrder = async () => {
    try {
      const { data } = await api.post("/orders", {
        eventId,
        sessionId,
        items,
      });

      const { ma_don_hang } = data;
      navigate({
        to: "/orders/$id/payment",
        params: {
          id: ma_don_hang,
        },
      });
    } catch (error) {
      if (error.response?.data?.seatId) {
        toast.error("Ghế đã được đặt, bạn chậm mất rồi");
        setItems(error.response?.data?.seatId);
      }
    }
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Vé/ghế đã chọn</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <div className="grid grid-cols-4">
            <span>Ghế</span>
            <span>Loại vé</span>
            <span>Đơn giá</span>
            <span>Số lượng</span>
          </div>
          {items.map((item) => {
            return (
              <div key={item.id} className="grid grid-cols-4">
                <span>
                  {item.hang_ghe}-{item.ma_ghe}
                </span>
                <span>{item.loai_ve}</span>
                <span>{item.don_gia}</span>
                <span>{item.so_luong}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button className={"flex-1"} onClick={handleCreateOrder}>
          Tiếp tục
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Cart;
