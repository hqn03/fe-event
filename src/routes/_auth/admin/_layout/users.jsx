import SimpleDataTable from "@/components/simple-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteUser, getUsers } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { IconTrash, IconEdit } from "@tabler/icons-react";
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
import { useState } from "react";
import UserForm from "@/components/user-form";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/admin/_layout/users")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [editingRecord, setEditingRecord] = useState(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const columns = [
    {
      accessorKey: "ho_ten",
      header: "Họ tên",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      header: "Vai trò",
      cell: ({ row }) => {
        const role = row.original.vai_tro?.ten_vai_tro;
        const color =
          role === "Super Admin"
            ? "destructive"
            : role === "Nhân viên"
              ? "default"
              : "secondary";

        return <Badge variant={color}>{role}</Badge>;
      },
    },
    {
      header: "Mã",
      accessorFn: (row) => {
        return row.khach?.ma_khach || row.nhanVien?.ma_nhan_vien || "—";
      },
    },
    {
      header: "SDT",
      accessorFn: (row) => {
        return row.so_dien_thoai || "—";
      },
    },
    {
      header: "Hành động",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                setEditingRecord(row.original);
              }}
            >
              <IconEdit />
            </Button>
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                if (confirm(`Xóa người dùng ${row.original.email}`)) {
                  toast.promise(deleteMutation.mutateAsync(row.original), {
                    loading: "Đang xóa",
                    success: "Xóa thành công",
                    error: ({ response }) => response.data,
                  });
                }
              }}
            >
              <IconTrash />
            </Button>
          </div>
        );
      },
    },
  ];

  const deleteMutation = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: deleteUser,
    onSuccess: ({ data }) => {
      queryClient.setQueryData(["users"], (old) => {
        if (!old) return [];
        return old.filter((e) => e.id_nguoi_dung !== data.id_nguoi_dung);
      });
    },
  });

  if (isLoading) return <div>loading</div>;

  return (
    <div>
      <div className="flex justify-end my-2">
        <Button
          onClick={() => {
            setEditingRecord({
              id_nguoi_dung: "",
              ho_ten: "",
              email: "",
              so_dien_thoai: "",
              ngay_sinh: "",
              gioi_tinh: "NAM",
              id_vai_tro: "",
              mat_khau: "",
            });
          }}
        >
          Tạo người dùng
        </Button>
      </div>

      <SimpleDataTable data={users} columns={columns} />

      <Dialog
        open={!!editingRecord}
        onOpenChange={() => setEditingRecord(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <UserForm
            initalData={editingRecord}
            setEditingRecord={setEditingRecord}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
