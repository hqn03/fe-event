import api from "@/services/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import SimpleDataTable, { TestDataTable } from "@/components/simple-data-table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/data-table";
import useDebounce from "@/hooks/useDebounce";
import { format } from "date-fns";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const Route = createFileRoute("/_auth/admin/_layout/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [date, setDate] = useState(new Date());
  const [inputSearch, setInputSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const debouncedSearch = useDebounce(inputSearch, 500);
  //   const { data, isLoading } = useQuery({
  //     queryKey: ["orders"],
  //     queryFn: () => api.get("orders/admin").then(({ data }) => data),
  //   });
  const canFetch =
    (!dateRange?.from && !dateRange?.to) || // ban đầu
    (dateRange?.from && dateRange?.to); // chọn đủ
  const { data, isLoading } = useQuery({
    queryKey: [
      "orders",
      pagination.pageIndex,
      pagination.pageSize,
      dateRange?.from,
      dateRange?.to,
      debouncedSearch,
    ],
    queryFn: () =>
      api
        .get("orders/admin", {
          params: {
            page: pagination.pageIndex + 1, // FE 0-based → BE 1-based
            limit: pagination.pageSize,
            from: dateRange?.from,
            to: dateRange?.to,
            q: debouncedSearch,
          },
        })
        .then((res) => res.data),
    enabled: !!canFetch,
    keepPreviousData: true,
  });

  const { data: dataChart, isLoading2 } = useQuery({
    queryKey: ["chart", dateRange?.from, dateRange?.to],
    queryFn: () =>
      api
        .get("orders/admin/summary-by-event", {
          params: {
            from: dateRange?.from,
            to: dateRange?.to,
          },
        })
        .then(({ data }) => data),
  });

  const handleSearch = () => {
    api.get("orders/admin", {
      params: {
        from: dateRange.from,
        to: dateRange.to,
        q: inputSearch,
      },
    });

    handleExportExcel;
  };

  const handleExportExcel = async () => {
    const res = await api.get("orders/export-excel", {
      params: {
        from: dateRange.from,
        to: dateRange.to,
        q: inputSearch,
      },
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

  if (isLoading) return "Loading...";
  if (isLoading2) return "Loading...";

  //   const grouped = Object.values(
  //     data.items.reduce((acc, item) => {
  //       const ma = item.phienSuKien.su_kien.ma_su_kien;
  //       if (!acc[ma]) {
  //         acc[ma] = {
  //           ma_su_kien: ma,
  //           ten_su_kien: item.phienSuKien.su_kien.ten_su_kien,
  //           total: 0,
  //         };
  //       }
  //       acc[ma].total += Number(item.tong_tien);
  //       return acc;
  //     }, {})
  //   );
  const dataMap = {
    labels: dataChart?.map((i) => i.ma_su_kien),
    datasets: [
      {
        label: "Doanh thu",
        data: dataChart?.map((i) => i.doanh_thu),
        eventNames: dataChart?.map((e) => e.ten_su_kien),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },

      tooltip: {
        enabled: true,
        callbacks: {
          title: (items) => {
            const dataset = items[0].dataset;
            const index = items[0].dataIndex;
            return dataset.eventNames[index]; // hiện TÊN SỰ KIỆN
          },
          label: (item) => {
            return "Doanh thu: " + item.raw.toLocaleString("vi-VN") + " ₫";
          },
        },
      },
    },

    scales: {
      x: {
        categoryPercentage: 0.6,
        barPercentage: 0.4,
        ticks: { maxRotation: 45 },
      },
    },

    datasets: {
      bar: { barThickness: 16 },
    },
  };

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
        // return format(); // 1.234.567
        return value;
      },
    },
  ];

  return (
    <div>
      <div className="h-[250px]">
        <Bar data={dataMap} options={options} />
      </div>
      {/* BUTTONS GROUP */}
      <div className="relative flex gap-2 items-end">
        <div className="mt-6">
          <Input
            placeholder={"Tìm kiếm ..."}
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="date-from" className="px-1">
            Từ ngày
          </Label>
          <Input
            id="date-from"
            value={formatDate(dateRange.from)}
            placeholder="from"
            className="w-48"
            onChange={(e) => {
              //   const date = new Date(e.target.value);
              //   setValue(e.target.value);
              //   if (isValidDate(date)) {
              //     setDate(date);
              //     setMonth(date);
              //   }
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="date-from" className="px-1">
            Từ ngày
          </Label>

          <Input
            id="date"
            value={formatDate(dateRange.to)}
            placeholder="to"
            className="bg-background w-48"
            onChange={(e) => {
              //   const date = new Date(e.target.value);
              //   setValue(e.target.value);
              //   if (isValidDate(date)) {
              //     setDate(date);
              //     setMonth(date);
              //   }
            }}
          />
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id="date-picker" variant="ghost" className={""}>
              <CalendarIcon />
              <span>Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="range"
              captionLayout="dropdown"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(dateRange) => {
                setDateRange(dateRange);
              }}
              className="rounded-lg border shadow-sm"
            />
          </PopoverContent>
        </Popover>
        <Button onClick={handleExportExcel}>Tìm kiếm</Button>
      </div>
      <TestDataTable
        columns={columns}
        data={data?.items ?? []}
        totalPages={data?.totalPages ?? 0}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
}
