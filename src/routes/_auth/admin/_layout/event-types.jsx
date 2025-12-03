import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { deleteEventType, getEventTypes } from "@/services/api";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
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
import EventTypeForm from "@/components/event-type-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SimpleDataTable from "@/components/simple-data-table";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/admin/_layout/event-types")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: eventTypes, isLoading } = useQuery({
    queryKey: ["event-types"],
    queryFn: getEventTypes,
  });
  const [editingRecord, setEditingRecord] = useState(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteEventType,
    onSuccess: ({ data }) => {
      queryClient.setQueryData(["event-types"], (old) => {
        if (!old) return [];
        return old.filter((e) => e.id !== data.id);
      });
    },
  });

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "ten_loai_su_kien",
      header: "Loai su kien",
    },
    {
      accessorKey: "duong_dan",
      header: "Duong dan",
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
                if (!confirm("Xác nhận xóa\n" + row.original.ten_loai_su_kien))
                  return;

                toast.promise(deleteMutation.mutateAsync(row.original), {
                  success: "Xoa thanh cong",
                  loading: "Dang xoa",
                  error: "Xoa bi loi",
                  position: "top-center",
                });
              }}
            >
              <IconTrash />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="py-8 px-4">
      <div className="">{/* <ChartAreaInteractive /> */}</div>
      <Button
        onClick={() => {
          setEditingRecord({
            id: "",
            ten_loai_su_kien: "",
            duong_dan: "",
          });
        }}
      >
        Tạo
      </Button>
      <SimpleDataTable data={eventTypes} columns={columns} />

      <Dialog
        open={!!editingRecord}
        onOpenChange={() => setEditingRecord(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <EventTypeForm
            initalData={editingRecord}
            setEditingRecord={setEditingRecord}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
