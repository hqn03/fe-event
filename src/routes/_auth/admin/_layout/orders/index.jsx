import api from "@/services/api";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import SimpleDataTable, { TestDataTable } from "@/components/simple-data-table";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
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
  Cell,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import autoTable from "jspdf-autotable";

export const Route = createFileRoute("/_auth/admin/_layout/orders/")({
  component: RouteComponent,
});

const GENDER_COLORS = {
  Nam: "#2563eb", // xanh
  Nữ: "#ec4899", // hồng
  Khác: "#9ca3af", // xám
};

const mapGender = (value) => {
  switch (value) {
    case "NAM":
      return "Nam";
    case "NU":
      return "Nữ";
    case "KHAC":
      return "Khác";
    default:
      return value;
  }
};

const renderLabel = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, value, stroke } =
    props;

  const RADIAN = Math.PI / 180;

  // % bên trong
  const rIn = innerRadius + (outerRadius - innerRadius) / 2;
  const xIn = cx + rIn * Math.cos(-midAngle * RADIAN);
  const yIn = cy + rIn * Math.sin(-midAngle * RADIAN);

  return (
    <>
      {/* % inside */}
      {percent > 0.05 && (
        <text
          x={xIn}
          y={yIn}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={12}
        >
          {(percent * 100).toFixed(0)}%
        </text>
      )}
    </>
  );
};
const CustomLegend = ({ payload }) => (
  <ul style={{ display: "flex", gap: 16, justifyContent: "center" }}>
    {payload.map((item, index) => {
      return (
        <li
          key={index}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              backgroundColor: `${item.payload.stroke}`, // màu theo stroke
            }}
          />
          <span>{item.value}</span>
        </li>
      );
    })}
  </ul>
);

function RouteComponent() {
  const refChart = useRef();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [from, setFrom] = useState(undefined);
  const [to, setTo] = useState(undefined);
  const [inputSearch, setInputSearch] = useState("");
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const debouncedSearch = useDebounce(inputSearch, 2000);

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

  // const orderByDayQuery = useQuery({
  //   queryKey: ["admin-order-by-date", debouncedSearch, from, to],
  //   queryFn: () =>
  //     api
  //       .get(`/admin/reports/orders-by-day`, {
  //         params: { from: from, to: to, q: debouncedSearch },
  //       })
  //       .then((res) => res.data),
  // });

  const genderQuery = useQuery({
    queryKey: ["admin-order-by-gender", debouncedSearch, from, to],
    queryFn: () =>
      api
        .get(`/admin/reports/gender`, {
          params: { from: from, to: to, q: debouncedSearch },
        })
        .then((res) => res.data),
  });

  const ageQuery = useQuery({
    queryKey: ["admin-order-by-age", debouncedSearch, from, to],
    queryFn: () =>
      api
        .get(`/admin/reports/age`, {
          params: { from: from, to: to, q: debouncedSearch },
        })
        .then((res) => res.data),
  });

  const orderEventTypeQuery = useQuery({
    queryKey: ["admin-order-by-event-type", debouncedSearch, from, to],
    queryFn: () =>
      api
        .get(`/admin/reports/event-type`, {
          params: { from: from, to: to, q: debouncedSearch },
        })
        .then((res) => res.data),
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

  const handleExportPDF = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.setFont("Roboto-Regular", "normal");

      const canvas = await html2canvas(refChart.current, {
        scale: 1,
        backgroundColor: "#fff",
      });

      pdf.addImage(canvas, "PNG", 10, 10, 180, 170);

      const { data } = await api.get(`/orders/admin`, {
        params: { limit: "all" },
      });

      const rows = data.items.map((i) => [
        i.ma_don_hang,
        i.phienSuKien.su_kien.ma_su_kien,
        i.phienSuKien.su_kien.ten_su_kien,
        i.ma_khach,
        i.phienSuKien.su_kien.ma_nhan_vien,
        Number(i.tong_tien).toLocaleString("vi-VN") + " đ",
        i.ngay_tao,
      ]);

      autoTable(pdf, {
        startY: 570,
        head: [
          [
            "Mã đơn",
            "Mã sự kiện",
            "Sự kiện",
            "Khách hàng",
            "Nhân viên",
            "Tổng tiền",
            "Ngày tạo",
          ],
        ],
        body: rows,
        styles: {
          fontSize: 9,
          font: "Roboto-Regular",
          fontStyle: "normal",
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          font: "Roboto-Regular",
          fontStyle: "normal",
        },
      });
      const fromString = from ? format(from, "yyyyMMdd") : "";
      const toString = to ? format(to, "yyyyMMdd") : "";
      pdf.save(`admin_report_${fromString}_${toString}.pdf`);
    } catch (error) {
      console.log(error);
    }
  };

  if (ordersQuery.isLoading || chartQuery.isLoading) return "Loading...";

  const columns = [
    {
      accessorKey: "ma_don_hang",
      header: "Mã đơn",
      cell: ({ row, getValue }) => (
        <Link
          to={`/admin/orders/${row.original.ma_don_hang}`}
          className="text-blue-600 hover:underline"
        >
          {getValue()}
        </Link>
      ),
    },
    {
      accessorKey: "phienSuKien.su_kien.ma_su_kien",
      header: "Mã sự kiện",
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
      accessorKey: "trang_thai",
      header: "Tình trạng",
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
    },
  ];

  if (ageQuery.isLoading || genderQuery.isLoading || chartQuery.isLoading)
    return <p>Loading ...</p>;

  const genderData = genderQuery.data.map((i) => ({
    gioi_tinh: mapGender(i.gioi_tinh),
    so_ve: i.so_ve,
  }));

  return (
    <div>
      <div className="mt-6" ref={refChart}>
        <div className="grid grid-cols-3 mb-16">
          <div className="max-h-[200px]">
            <h3 className="mb-2 text-center font-semibold">
              Thống kê khách hàng theo giới tính
            </h3>
            <ResponsiveContainer width={"100%"} height={"100%"}>
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey={"so_ve"}
                  nameKey={"gioi_tinh"}
                  outerRadius={80}
                  label={renderLabel}
                >
                  {genderData.map((item, index) => (
                    <Cell
                      key={index}
                      fill="#fff"
                      stroke={GENDER_COLORS[item.gioi_tinh]}
                      strokeWidth={3} // border
                    />
                  ))}
                </Pie>
                <Legend content={<CustomLegend />} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="max-h-[200px]">
            <h3 className="mb-2 text-center font-semibold">
              Thống kê khách hàng theo nhóm tuổi
            </h3>
            <ResponsiveContainer width={"100%"} height={"100%"}>
              <BarChart data={ageQuery.data}>
                <XAxis dataKey="nhom_tuoi" name="Nhóm tuổi">
                  <Label
                    value="Nhóm tuổi"
                    position="insideBottom"
                    offset={-5}
                  />
                </XAxis>
                <YAxis>
                  <Label
                    value="Số vé"
                    angle={-90}
                    position="insideLeft"
                    style={{ textAnchor: "middle" }}
                  />
                </YAxis>
                {/* <YAxis /> */}
                <Tooltip />
                <Bar
                  dataKey="so_ve"
                  name={"Số lượng"}
                  fill="none"
                  stroke="#000"
                  strokeWidth={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="max-h-[200px]">
            <h3 className="mb-2 text-center font-semibold">
              Thống kê doanh thu theo danh mục sự kiện
            </h3>
            <ResponsiveContainer width={"100%"} height={"100%"}>
              <BarChart data={orderEventTypeQuery.data}>
                <XAxis dataKey="ten_loai_su_kien" name="Nhóm tuổi">
                  <Label
                    value="Nhóm tuổi"
                    position="insideBottom"
                    offset={-5}
                  />
                </XAxis>
                <YAxis>
                  <Label
                    value="Doanh thu"
                    angle={-90}
                    position="insideLeft"
                    style={{ textAnchor: "middle" }}
                  />
                </YAxis>
                {/* <YAxis /> */}
                <Tooltip />
                <Bar
                  dataKey="doanh_thu"
                  name={"Doanh thu"}
                  fill="none"
                  stroke="#000"
                  strokeWidth={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* <div className="h-[300px]">
          <h3 className="mb-2 text-center font-semibold">
            Thống kê doanh thu theo ngày
          </h3>
          <ResponsiveContainer width="100%" height={"100%"}>
            <ComposedChart data={orderByDayQuery.data}>
              <XAxis
                dataKey="ngay"
                type="category"
                interval={0}
                // padding={{ left: 0, right: 0 }}
                textAnchor={"end"}
                angle={-45}
                height={80}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />

              <Tooltip />
              <Legend />

              <Bar
                yAxisId="left"
                dataKey="so_ve"
                name="Số vé"
                barSize={10}
                fill="none"
                stroke="#000"
                strokeWidth={2}
                alignmentBaseline="left"
              />

              <Line yAxisId="right" dataKey="doanh_thu" name="Doanh thu" />
            </ComposedChart>
          </ResponsiveContainer>
        </div> */}
        <div className="h-[300px] mt-14">
          <h3 className="mb-2 text-center font-semibold">
            Tổng doanh thu theo sự kiện
          </h3>
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
              <Bar
                dataKey="tong_doanh_thu"
                name={"Doanh thu"}
                fill="none"
                stroke="#000"
                strokeWidth={2}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="h-10"></div>
      </div>

      {/* BUTTONS GROUP */}
      <div className="relative flex gap-2 justify-end items-end mb-6">
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
        <Button variant={"outline"} onClick={handleExportExcel}>
          Xuất Excel
        </Button>
        <Button variant={"outline"} onClick={handleExportPDF}>
          Xuất PDF
        </Button>
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
