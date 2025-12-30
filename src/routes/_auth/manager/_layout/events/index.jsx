import { deleteEvent, getManagerEvents, publishEvent } from "@/services/api";
import {
  createFileRoute,
  Link,
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
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_auth/manager/_layout/events/")({
  component: RouteComponent,
});

const STATUS_COLORS = {
  DANG_XU_LY: "text-black-600",
  SAP_DIEN_RA: "text-green-600",
  KET_THUC: "text-red-600",
};

function RouteComponent() {
  const [status, setStatus] = useState("ALL");
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/manager/events/" });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getManagerEvents,
  });

  const filteredEvents = useMemo(() => {
    if (status === "ALL") return events;

    return events.filter((s) => s.trang_thai === status);
  }, [events, status]);
  const columns = [
    {
      accessorKey: "ma_su_kien",
      header: "ID",
    },
    {
      accessorKey: "ten_su_kien",
      header: "Tên sự kiện",
      cell: ({ row }) => (
        <Link
          to={"$eventId"}
          params={{ eventId: row.original.ma_su_kien }}
          search={{ type: "edit" }}
          className="max-w-[400px] line-clamp-1 truncate"
        >
          {row.original.ten_su_kien}
        </Link>
      ),
    },
    {
      accessorKey: "loai_su_kien.ten_loai_su_kien",
      header: "Loại sự kiện",
    },
    {
      accessorKey: "ngay_bat_dau",
      header: "Ngày bắt đầu",
      cell: ({ row }) => {
        return <div>{format(row.original.ngay_bat_dau, "dd/MM/yyyy")}</div>;
      },
    },
    {
      accessorKey: "trang_thai",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.original.trang_thai;
        return (
          <Badge variant={"secondary"} className={`${STATUS_COLORS[status]}`}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "",
      header: "Hành động",
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
                  navigate({
                    to: "$eventId",
                    params: { eventId: eventId },
                    search: { type: "edit" },
                  });
                }}
              >
                Edit event
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate({
                    to: "$eventId",
                    params: { eventId: eventId },
                    search: { type: "sessions" },
                  });
                }}
              >
                Edit sessions
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate({
                    to: "$eventId",
                    params: { eventId: eventId },
                    search: { type: "tickets" },
                  });
                }}
              >
                Edit tickets
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate({
                    to: "$eventId",
                    params: { eventId: eventId },
                    search: { type: "seats" },
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
  console.log(filteredEvents);

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            navigate({ to: "create" });
          }}
        >
          Tạo sự kiện
        </Button>
      </div>
      <div className="flex justify-end mb-4">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="DANG_XU_LY">Đang xử lý</SelectItem>
              <SelectItem value="SAP_DIEN_RA">Sắp diễn ra</SelectItem>
              <SelectItem value="KET_THUC">Kết thúc</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <SimpleDataTable data={filteredEvents} columns={columns} />
    </div>
  );
}
