import SimpleDataTable from "@/components/simple-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { formatVND, formatVNDCurrency } from "@/lib/utils";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_auth/admin/_layout/orders/$idOrder")({
  component: RouteComponent,
});

function RouteComponent() {
  const { idOrder } = useParams({});

  const detailOrderQuery = useQuery({
    queryKey: ["admin-detail-order", idOrder],
    queryFn: () => api.get(`/admin/orders/${idOrder}`).then((res) => res.data),
    enabled: !!idOrder,
  });
  if (detailOrderQuery.isLoading) return <div>Loading ...</div>;

  console.log(detailOrderQuery.data);

  const columns = [
    {
      accessorKey: "ma_ghe",
      header: "Ghế",
      cell: ({ row }) => {
        const value = row.getValue("ma_ghe");
        return value ? value : "Không";
      },
    },
    {
      accessorKey: "ten_loai_ve",
      header: "Tên loại vé",
    },
    {
      accessorKey: "don_gia",
      header: "Giá",
      cell: ({ row }) => formatVNDCurrency(row.getValue("don_gia")),
    },
    {
      accessorKey: "so_luong",
      header: "Số lượng",
    },
    {
      accessorKey: "thanh_tien",
      header: "Thành tiền",
      cell: ({ row }) => formatVNDCurrency(row.getValue("thanh_tien")),
    },
  ];
  return (
    <div className="p-6">
      <Link to={"/admin/orders/"} className="flex gap-4">
        <ArrowLeft /> Back
      </Link>
      <div className="grid grid-cols-3 gap-4 mt-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin đặt vé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <span>Mã đơn: </span>
              <p>{detailOrderQuery.data.ma_don_hang}</p>
            </div>
            <div className="flex gap-4 ">
              <span>Tình trạng đơn: </span>
              <p>{detailOrderQuery.data.trang_thai}</p>
            </div>
            <div className="flex gap-4 ">
              <span>Tổng tiền:</span>
              <p>{formatVNDCurrency(detailOrderQuery.data.tong_tien)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin sự kiện</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <span>Mã sự kiện: </span>
              <p>{detailOrderQuery.data.phienSuKien.su_kien.ma_su_kien}</p>
            </div>
            <div className="flex gap-4 ">
              <span>Tên sự kiện: </span>
              <p>{detailOrderQuery.data.phienSuKien.su_kien.ten_su_kien}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khách đặt vé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <span>Khách hàng: </span>
              <p>{detailOrderQuery.data.nguoi_dat_ve.nguoi_dung.ho_ten}</p>
            </div>
            <div className="flex gap-4">
              <span>Email: </span>
              <p>{detailOrderQuery.data.nguoi_dat_ve.nguoi_dung.email}</p>
            </div>
            <div className="flex gap-4">
              <span>Số điện thoại</span>
              <p>
                {detailOrderQuery.data.nguoi_dat_ve.nguoi_dung.so_dien_thoai}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <SimpleDataTable
        columns={columns}
        data={detailOrderQuery.data.chiTietDatVes ?? []}
      />
    </div>
  );
}
