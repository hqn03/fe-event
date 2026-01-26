import { useMutation } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import React, { useState } from "react";
import { Button } from "./ui/button";
import api from "@/services/api";
import Cart from "./cart";

export default function TicketBooking({ tickets }) {
  const { event, session } = useSearch({ from: "/_auth/ticket-booking" });
  const [cart, setCart] = useState([]);

  const updateQty = (id, delta, t) => {
    setCart((prev) => {
      const { ten_ve: loai_ve, gia_ve: don_gia } = t;

      const idx = prev.findIndex((i) => i.id === id);
      let so_luong = idx >= 0 ? prev[idx].so_luong + delta : delta;
      if (so_luong > t.so_luong_mua_max) so_luong = t.so_luong_mua_max;
      if (so_luong > t.so_luong_con) so_luong = t.so_luong_con;
      if (so_luong <= 0) return prev.filter((i) => i.id !== id);
      if (idx >= 0) {
        const n = [...prev];
        n[idx] = { id, so_luong, loai_ve, don_gia };
        return n;
      }

      return [...prev, { id, so_luong, loai_ve, don_gia }];
    });
    // setCart((prev) => {
    //   const idx = prev.findIndex((i) => i.id === id);
    //   let qty = idx >= 0 ? prev[idx].qty + delta : delta;
    //   const price = Number(t.gia_ve);

    //   if (qty > t.so_luong_mua_max) qty = t.so_luong_mua_max;
    //   if (qty > t.so_luong_con) qty = t.so_luong_con;

    //   if (qty <= 0) return prev.filter((i) => i.id !== id);

    //   if (idx >= 0) {
    //     const n = [...prev];
    //     n[idx] = { id, qty, price };
    //     return n;
    //   }
    //   return [...prev, { id, qty, price }];
    // });
  };

  const cartItems = cart.map((i) => ({
    ...i,
    ticket: tickets.find((t) => t.id_loai_ve === i.id),
  }));

  // const total = cartItems.reduce((s, i) => s + i.qty * i.price, 0);

  if (!tickets) return <></>;

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Vé */}
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">Danh sách vé</h2>
        {tickets.map((t) => {
          const item = cart.find((i) => i.id === t.id_loai_ve);
          return (
            <div key={t.id_loai_ve} className="border p-3 rounded-2xl shadow">
              <p className="text-xl font-medium">{t.ten_ve}</p>
              <p>
                {Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(t.gia_ve)}
              </p>
              {/* <p className="text-sm">Còn: {t.so_luong_con}</p> */}
              <div className="flex gap-2 mt-2 items-center">
                <button
                  onClick={() => updateQty(t.id_loai_ve, -1, t)}
                  className="px-2 border rounded"
                >
                  −
                </button>
                <span className="w-10 text-center">{item?.so_luong || 0}</span>
                <button
                  onClick={() => updateQty(t.id_loai_ve, +1, t)}
                  className="px-2 border rounded"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Giỏ */}
      <div>
        <Cart eventId={event} sessionId={session} items={cart} />
      </div>
      {/* <div className="border p-3 rounded-2xl shadow h-fit">
        <h2 className="text-2xl font-semibold mb-2">Vé đã đặt</h2>
        {cartItems.length === 0 && <p>Chưa chọn vé</p>}

        {cartItems.map((i) => (
          <div key={i.id} className="flex justify-between border-b py-2">
            <div>
              <p className="font-medium">{i.ticket?.ten_ve}</p>
              <p className="text-sm">SL: {i.qty}</p>
              <p className="text-sm">Đơn giá: {i.price.toLocaleString()} đ</p>
            </div>
            <p className="font-medium">
              {(i.qty * i.price).toLocaleString()} đ
            </p>
          </div>
        ))}

        <div className="text-right text-xl font-semibold mt-3">
          Tổng: {total.toLocaleString()} đ
        </div>

        <Button
          className="w-full bg-black text-white py-2 rounded-2xl mt-3"
          onClick={() => {
            if (!cart.length) {
              alert("Vui lòng chọn vé để thanh toán");
              return;
            }
            api
              .post("/orders", {
                event,
                session,
                total,
                cart,
              })
              .then(({ data }) => {
                window.location.href = data;
              });
          }}
        >
          Thanh toán
        </Button>
      </div> */}
    </div>
  );
}
