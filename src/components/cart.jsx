import api from "@/services/api";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { useNavigate } from "@tanstack/react-router";

const Cart = ({ eventId, sessionId, items }) => {
  const navigate = useNavigate({});
  const handleCreateOrder = async () => {
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
  };
  return (
    <Card className="">
      {/* <div>Tổng cộng: {total}</div> */}
      <CardHeader></CardHeader>
      <CardContent>
        <div>
          <div className="grid grid-cols-3">
            <span>Loại vé</span>
            <span>Đơn giá</span>
            <span>Số lượng</span>
          </div>
          {items.map((item) => {
            return (
              <div key={item.id} className="grid grid-cols-3">
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
