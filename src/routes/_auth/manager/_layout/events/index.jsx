import { deleteEvent, getManagerEvents, publishEvent } from "@/services/api";
import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import SimpleDataTable from "@/components/simple-data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/_auth/manager/_layout/events/")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/manager/events/" });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getManagerEvents,
  });
  const columns = [
    {
      accessorKey: "ma_su_kien",
      header: "ID",
    },
    {
      accessorKey: "ten_su_kien",
      header: "Event name",
      cell:({row}) => (<div className="max-w-[400px] line-clamp-1 truncate">{row.original.ten_su_kien}</div>)
    },
    {
      accessorKey: "loai_su_kien.ten_loai_su_kien",
      header: "Loai su kien",
    },
    {
      accessorKey: "ngay_bat_dau",
      header: "Date",
      cell: ({ row }) => {
        return <div>{format(row.original.ngay_bat_dau, "dd/MM/yyyy")}</div>;
      },
    },
    {
      accessorKey: "trang_thai",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.trang_thai;
        return <Badge>{status}</Badge>;
      },
    },
    {
      accessorKey: "",
      header: "Action",
      cell: ({ row }) => {
        const eventId = row.original.ma_su_kien;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  toast.promise(publishMutation.mutateAsync({ id: eventId }), {
                    loading: "Đang gửi duyệt",
                    success: "Gửi duyệt thành công",
                    error: "Gửi duyệt thất bại",
                  });
                  // console.log("edit ", eventId);
                }}
              >
                Gửi duyệt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  console.log("edit ", eventId);
                }}
              >
                Edit event
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate({
                    to: "$eventId",
                    params: {
                      eventId: eventId,
                    },
                    search: {
                      type: "sessions",
                    },
                  });
                }}
              >
                Edit sessions
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate({
                    to: "$eventId",
                    params: {
                      eventId: eventId,
                    },
                    search: {
                      type: "tickets",
                    },
                  });
                }}
              >
                Edit tickets
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate({
                    to: "$eventId",
                    params: {
                      eventId: eventId,
                    },
                    search: {
                      type: "seats",
                    },
                  });
                }}
              >
                Edit seats
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={"text-red-500"}
                onClick={() => {
                  toast.promise(deleteMutation.mutateAsync({ id: eventId }), {
                    loading: "Dang xoa",
                    success: "Xoa thanh cong",
                    error: "Xoa that bai",
                  });
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const deleteMutation = useMutation({
    mutationKey: ["delete-event"],
    mutationFn: deleteEvent,
    onSuccess: ({ data }) => {
      const { ma_su_kien } = data;
      queryClient.setQueryData(["events"], (prev) => {
        return prev.filter((s) => s.ma_su_kien !== ma_su_kien);
      });
    },
  });

  const publishMutation = useMutation({
    mutationKey: ["publishEvent"],
    mutationFn: publishEvent,
    onSuccess: ({ data }) => {
      console.log(data);
      queryClient.setQueryData(["events"], (prev) => {
        return prev.map((e) => (e.ma_su_kien === data.ma_su_kien ? data : e));
      });
    },
  });

  if (isLoading) return <div>Loading....</div>;

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            navigate({
              to: "create",
            });
          }}
        >
          Tạo sự kiện
        </Button>
      </div>
      <SimpleDataTable data={events} columns={columns} />
    </div>
  );
}
