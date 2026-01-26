import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import SimpleDataTable from "@/components/simple-data-table";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const Route = createFileRoute("/_auth/manager/_layout/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: test, isLoading } = useQuery({
    queryKey: ["profit"],
    queryFn: () => api.get("orders/manager").then(({ data }) => data),
  });

  if (isLoading) return "Loading...";

  const grouped = Object.values(
    test.reduce((acc, item) => {
      const ma = item.phienSuKien.su_kien.ma_su_kien;
      if (!acc[ma]) {
        acc[ma] = {
          ma_su_kien: ma,
          ten_su_kien: item.phienSuKien.su_kien.ten_su_kien,
          total: 0,
        };
      }
      acc[ma].total += Number(item.tong_tien);
      return acc;
    }, {})
  );

  const data = {
    labels: grouped.map((i) => i.ma_su_kien),
    datasets: [
      {
        label: "Doanh thu",
        data: grouped.map((i) => i.total),
        eventNames: grouped.map((e) => e.ten_su_kien),
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
      accessorKey: "tong_tien",
      header: "Tổng tiền",
      cell: ({ row }) => {
        const value = row.getValue("tong_tien");
        return Number(value).toLocaleString("vi-VN"); // 1.234.567
      },
    },
  ];

  return (
    <div>
      <div className="h-[250px]">
        <Bar data={data} options={options} />
      </div>
      <SimpleDataTable data={test} columns={columns} />
    </div>
  );
}
