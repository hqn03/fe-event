import RejectForm from "@/components/reject-form";
import SimpleDataTable from "@/components/simple-data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { getEventApprovals, updateEventApproval } from "@/services/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/admin/_layout/events/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({});
  const [id, setId] = useState("");
  const { data: eventApprovals = [], isLoading } = useQuery({
    queryKey: ["event-approvals"],
    queryFn: getEventApprovals,
  });

  const approveMutation = useMutation({
    mutationKey: ["approve-event"],
    mutationFn: updateEventApproval,
  });

  if (isLoading) return <div>Loading....</div>;

  const columns = [
    {
      accessorKey: "ma_su_kien",
      header: "ID",
    },
    {
      accessorKey: "su_kien.ten_su_kien",
      header: "Tên sự kiện",
    },
    {
      accessorKey: "ngay_tao",
      header: "Ngày gửi",
    },
    {
      header: "Hành động",
      cell: ({ row }) => {
        const id = row.original.id_su_kien_phe_duyet;
        return (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                navigate({
                  to: row.original.ma_su_kien,
                });
              }}
              variant={"outline"}
            >
              Xem
            </Button>
            <Button
              onClick={() => {
                if (confirm(`Xác nhận duyệt ${row.original.ma_su_kien}`)) {
                  toast.promise(
                    approveMutation.mutateAsync({
                      id,
                      trang_thai: "DUOC_PHE_DUYET",
                    }),
                    {
                      loading: "Đang cập nhật",
                      success: "Cập nhật thành công",
                      error: "Cập nhật thất bại",
                      position: "top-center",
                    }
                  );
                }
              }}
            >
              Duyệt
            </Button>
            <Button variant={"destructive"} onClick={() => setId(id)}>
              Từ chối
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <SimpleDataTable data={eventApprovals} columns={columns} />

      <Dialog
        open={!!id}
        onOpenChange={() => {
          setId("");
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Từ chối đăng sự kiện</DialogTitle>
          <DialogDescription>Nhập lý do từ chối sự kiện</DialogDescription>
          <RejectForm id={id} setId={setId} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
