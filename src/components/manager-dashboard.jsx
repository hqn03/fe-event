import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  BarChart,
  Label,
} from "recharts";
import { Input } from "./ui/input";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { TestDataTable } from "./simple-data-table";
import { Field, FieldLabel } from "./ui/field";

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

const columns = [
  {
    accessorKey: "ma_don_hang",
    header: "Mã đơn",
  },
  {
    accessorKey: "ho_ten",
    header: "Khách hàng",
  },
  {
    accessorKey: "so_ve",
    header: "Số lượng vé",
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

const ManagerDashboardOrder = ({ eventId }) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [open, setOpen] = useState(false);
  const canFetch =
    (!dateRange?.from && !dateRange?.to) || // ban đầu
    (dateRange?.from && dateRange?.to); // chọn đủ

  const orderQuery = useQuery({
    queryKey: [
      "event-orders",
      eventId,
      pagination.pageIndex,
      pagination.pageSize,
      dateRange?.from,
      dateRange?.to,
    ],
    queryFn: () =>
      api
        .get(`/manager/events/${eventId}/orders`, {
          params: {
            page: pagination.pageIndex + 1, // FE 0-based → BE 1-based
            limit: pagination.pageSize,
            from: dateRange?.from,
            to: dateRange?.to,
          },
        })
        .then(({ data }) => data),
    enabled: !!canFetch,
    keepPreviousData: true,
  });

  const orderByDayQuery = useQuery({
    queryKey: ["orderByDay", eventId],
    queryFn: () =>
      api
        .get(`/manager/events/${eventId}/reports/orders-by-day`)
        .then(({ data }) => data),
  });

  const genderQuery = useQuery({
    queryKey: ["gender", eventId],
    queryFn: () =>
      api
        .get(`/manager/events/${eventId}/reports/gender`)
        .then(({ data }) => data),
  });

  const ageQuery = useQuery({
    queryKey: ["age", eventId],
    queryFn: () =>
      api
        .get(`/manager/events/${eventId}/reports/age`)
        .then(({ data }) => data),
  });

  if (orderByDayQuery.isLoading || ageQuery.isLoading || genderQuery.isLoading)
    return <p>Loading ...</p>;

  const genderData = genderQuery.data.map((i) => ({
    gioi_tinh: mapGender(i.gioi_tinh),
    so_ve: i.so_ve,
  }));

  const data1 = [
    { name: "T1", ve: 120, doanhThu: 2400000 },
    { name: "T2", ve: 180, doanhThu: 3600000 },
    { name: "T3", ve: 150, doanhThu: 3000000 },
  ];
  return (
    <div className="py-8">
      <div className="grid grid-cols-2 mb-16">
        <div className="max-h-[200px]">
          <h3 className="mb-2 text-center font-semibold">
            Thống kê theo giới tính
          </h3>
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey={"so_ve"}
                nameKey={"gioi_tinh"}
                innerRadius={0}
                label
              >
                {genderData.map((item, index) => (
                  <Cell
                    key={index}
                    fill={GENDER_COLORS[item.gioi_tinh] ?? "#d1d5db"}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="max-h-[200px]">
          <h3 className="mb-2 text-center font-semibold">
            Thống kê theo nhóm tuổi
          </h3>
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <BarChart data={ageQuery.data}>
              <XAxis dataKey="nhom_tuoi" name="Nhóm tuổi">
                <Label value="Nhóm tuổi" position="insideBottom" offset={-5} />
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
              <Bar dataKey="so_ve" name={"Số lượng"} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="h-[300px]">
        <h3 className="mb-2 text-center font-semibold">Doanh thu</h3>
        <ResponsiveContainer width="100%" height={"100%"}>
          <ComposedChart data={orderByDayQuery.data}>
            <XAxis
              dataKey="ngay"
              type="category"
              interval={0}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />

            <Tooltip />
            <Legend />

            <Bar
              yAxisId="left"
              dataKey="so_ve"
              name="Số vé"
              barSize={30}
              alignmentBaseline="left"
            />

            <Line yAxisId="right" dataKey="doanh_thu" name="Doanh thu" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* MANAGER DASH BOARD ORDER */}
      {}
      <div className="mt-16">
        <div className="flex justify-end mb-4 gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button id="date-picker" variant="ghost" className={""}>
                <CalendarIcon />
                <span>Chọn khoảng ngày</span>
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

          <Field orientation="horizontal" className={"w-[250px] flex-none"}>
            <FieldLabel htmlFor="date-from" className={"flex-none!"}>
              Từ ngày
            </FieldLabel>
            <Input
              id="date-from"
              value={formatDate(dateRange.from)}
              placeholder="from"
              className="w-48"
              onChange={(e) => {
                // const date = new Date(e.target.value);
                // setValue(e.target.value);
                // if (isValidDate(date)) {
                //   setDate(date);
                //   setMonth(date);
                // }
              }}
            />
          </Field>
          <Field orientation="horizontal" className={"w-[250px]"}>
            <FieldLabel htmlFor="date-to" className={"flex-none!"}>
              Đến ngày
            </FieldLabel>
            <Input
              id="date-to"
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
          </Field>
        </div>

        <TestDataTable
          columns={columns}
          data={orderQuery.data?.items ?? []}
          totalPages={orderQuery.data?.totalPages ?? 0}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </div>
  );
};

export default ManagerDashboardOrder;
