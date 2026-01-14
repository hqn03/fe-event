import SimpleDataTable from "@/components/simple-data-table";
import { formatDate, formatDateTime } from "@/lib/utils";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/manager/_layout/events-approval")({
  component: RouteComponent,
});

function RouteComponent() {
  const eventsApprovalQuery = useQuery({
    queryKey: ["manager-events-approval"],
    queryFn: () =>
      api.get("manager/events/events-approval").then((res) => res.data),
  });

  if (eventsApprovalQuery.isLoading) return <div>Loading....</div>;
  console.log(eventsApprovalQuery.data);
  const columns = [
    {
      accessorKey: "su_kien.ten_su_kien",
      header: "Sự kiện",
      cell: ({ getValue }) => (
        <div className="max-w-40 truncate">{getValue()}</div>
      ),
    },
    {
      accessorKey: "trang_thai",
      header: "Tình trạng",
    },
    {
      accessorKey: "ghi_chu",
      header: "Ghi chú",
    },
    {
      accessorKey: "ngay_tao",
      header: "Ngày gửi",
      cell: ({ row }) => (
        <div>{formatDateTime(new Date(row.original.ngay_tao))}</div>
      ),
    },
    {
      accessorKey: "ngay_duyet",
      header: "Ngày duyệt",
      cell: ({ row }) => (
        <div>{formatDateTime(new Date(row.original.ngay_duyet))}</div>
      ),
    },
    {
      accessorKey: "nguoiDuyet.ho_ten",
      header: "Người duyệt",
    },
  ];
  return (
    <div>
      <SimpleDataTable columns={columns} data={eventsApprovalQuery.data} />
    </div>
  );
}
