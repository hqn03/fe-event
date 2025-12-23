import api from "@/services/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import SimpleDataTable, { TestDataTable } from "@/components/simple-data-table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime, formatVND } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/data-table";
import useDebounce from "@/hooks/useDebounce";
import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/_auth/admin/_layout/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const [inputSearch, setInputSearch] = useState("");
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const debouncedSearch = useDebounce(inputSearch, 500);

  const canFetch = (!from && !to) || Boolean(from && to);
  const ordersQuery = useQuery({
    queryKey: [
      "orders",
      pagination.pageIndex,
      pagination.pageSize,
      debouncedSearch,
      from,
      to,
    ],
    queryFn: () =>
      api
        .get("orders/admin", {
          params: {
            page: pagination.pageIndex + 1, // FE 0-based → BE 1-based
            limit: pagination.pageSize,
            q: debouncedSearch,
            from: from,
            to: to,
          },
        })
        .then((res) => res.data),
    enabled: canFetch,
    keepPreviousData: true,
  });

  const chartQuery = useQuery({
    queryKey: ["summary-by-event", from, to, debouncedSearch],
    queryFn: () =>
      api
        .get("orders/admin/summary-by-event", {
          params: {
            q: debouncedSearch,
            from: from,
            to: to,
          },
        })
        .then(({ data }) => data),
  });

  const handleSearch = () => {
    api.get("orders/admin", {
      params: {
        from: from,
        to: to,
        q: inputSearch,
      },
    });

    handleExportExcel;
  };

  const handleExportExcel = async () => {
    const res = await api.get("orders/export-excel", {
      params: { from: from, to: to, q: debouncedSearch },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(
      new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.xlsx";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (ordersQuery.isLoading || chartQuery.isLoading) return "Loading...";

  const columns = [
    {
      accessorKey: "ma_don_hang",
      header: "Mã đơn",
    },
    {
      accessorKey: "phienSuKien.su_kien.ten_su_kien",
      header: "Sự kiện",
    },
    {
      accessorKey: "ma_khach",
      header: "Khách hàng",
    },
    {
      accessorKey: "phienSuKien.su_kien.ma_nhan_vien",
      header: "Nhân viên",
    },
    {
      accessorKey: "tong_tien",
      header: "Tổng tiền",
      cell: ({ row }) => {
        const value = row.getValue("tong_tien");
        return Number(value).toLocaleString("vi-VN"); // 1.234.567
      },
    },
    {
      accessorKey: "ngay_tao",
      header: "Ngày tạo",
      cell: ({ row }) => {
        const value = row.getValue("ngay_tao");
        return formatDateTime(value);
      },
    },
  ];

  return (
    <div>
      <ResponsiveContainer className={"py-2"} width="100%" height={300}>
        <BarChart data={chartQuery.data}>
          <XAxis dataKey="ma_su_kien" />
          <YAxis tickFormatter={(value) => formatVND(value)} />
          <Tooltip
            labelFormatter={(ma) => {
              const item = chartQuery.data.find((d) => d.ma_su_kien === ma);
              return item?.ten_su_kien ?? ma;
            }}
          />
          <Bar dataKey="tong_doanh_thu" name={"Doanh thu"} />
        </BarChart>
      </ResponsiveContainer>

      {/* BUTTONS GROUP */}
      <div className="relative flex gap-2 items-end">
        <div className="mt-6">
          <Label>Tìm kiếm</Label>
          <Input
            placeholder={"Tên sự kiện, mã sự kiện ..."}
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="date" className="px-1">
            Từ ngày
          </Label>
          <Popover open={openFrom} onOpenChange={setOpenFrom}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {from ? from.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={from}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setFrom(date);
                  setOpenFrom(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="date" className="px-1">
            Đến ngày
          </Label>
          <Popover open={openTo} onOpenChange={setOpenTo}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {to ? to.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={to}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setTo(date);
                  setOpenTo(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={handleExportExcel}>Xuất Excel</Button>
      </div>
      <TestDataTable
        columns={columns}
        data={ordersQuery.data?.items ?? []}
        totalPages={ordersQuery.data?.totalPages ?? 0}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
}
