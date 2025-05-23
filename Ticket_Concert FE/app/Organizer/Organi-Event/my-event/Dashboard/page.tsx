// pages/Statistics.tsx
"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import LeftSidebar from "../component/menu";
import TopSidebar from "@/components/topSide-Organizer";
import "./dashboard.css";
import "../../../style/Home.css";
import { SoLuongVe, DoanhThu } from "@/interfaces/DashBoard";
import { dashboardService } from "@/services/DashBoard";
import { Chart as ChartJS, LineElement,  CategoryScale, LinearScale, ChartOptions, PointElement, Title, Tooltip,Legend,} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

export default function Statistics() {
  const [timeRange, setTimeRange] = useState<"24 giờ" | "30 ngày">("30 ngày");
  const [doanhthus, setDoanhthus] = useState<DoanhThu | null>(null);
  const [tongVe, setTongVe] = useState<SoLuongVe | null>(null);
  const [totalDoanhThu, setTotalDoanhThu] = useState<number>(0);
  const [totalVeBan, setTotalVeBan] = useState<number>(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const eventId = localStorage.getItem("IDSuKien_Organizer_Detail");
        if (!eventId) {
          console.error("Không tìm thấy IDSukien_Organizer_Detail trong localStorage");
          return;
        }
        console.log(eventId);

        const doanhthu = await dashboardService.getdoanhthu(eventId);
        const luongve = await dashboardService.getVeDaBan(eventId);
        console.log("Dữ liệu số vé đã bán từ API:", luongve);

        setDoanhthus(doanhthu);
        setTongVe(luongve);
        console.log(luongve);

        const doanhThuValue = Number(doanhthu?.TongDoanhThu) || 0;
        const veBanValue = Number(luongve?.TongVeDaBan) || 0;


        setTotalDoanhThu(doanhThuValue);
        setTotalVeBan(veBanValue);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetch();
  }, []);

  // Giả lập dữ liệu biểu đồ
  const dataPoints = timeRange === "30 ngày" ? 30 : 24;
  const doanhThuPerPoint = totalDoanhThu / dataPoints;
  const veBanPerPoint = totalVeBan / dataPoints;

  const doanhThuData = Array.from({ length: dataPoints }, (_, i) =>
    Math.round(doanhThuPerPoint * (i + 1))
  );
  const veBanData = Array.from({ length: dataPoints }, (_, i) =>
    Math.round(veBanPerPoint * (i + 1))
  );

  const chartData = {
    labels: timeRange === "30 ngày"
      ? Array.from({ length: 30 }, (_, i) => `Ngày ${i + 1}`)
      : Array.from({ length: 24 }, (_, i) => `${i}h`),
    datasets: [
      {
        label: "Doanh thu",
        data: doanhThuData,
        borderColor: "#6f42c1",
        backgroundColor: "rgba(111, 66, 193, 0.2)",
        tension: 0.4,
        yAxisID: "y1",
      },
      {
        label: "Số vé đã bán",
        data: veBanData,
        borderColor: "#28a745",
        backgroundColor: "rgba(40, 167, 69, 0.2)",
        tension: 0.4,
        yAxisID: "y2",
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return label === "Doanh thu" ? `${label}: ${value.toLocaleString()}đ` : `${label}: ${value} vé`;
          },
        },
      },
    },
    scales: {
      y1: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Doanh thu (đ)",
        },
        min: 0,
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
      },
      y2: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Số vé đã bán",
        },
        min: 0,
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        title: {
          display: true,
          text: "Thời gian",
        },
      },
    },
  };

  return (
    <>
      <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
      />
      <div className="d-flex">
        <LeftSidebar />
        <div
          id="right"
          className="overflow-auto w-100"
          style={{ background: "linear-gradient(rgb(15, 46, 29), rgb(30 10 30))" }}>
          <TopSidebar title="Sự kiện của tôi" />
          <div className="container py-4 px-3" style={{ height: "max-content" }}>
            <div className="row mb-4 g-4">
              {/* Thẻ Doanh thu */}
              <div className="col-md-4">
                <div className="card text-white bg-dark stats-card">
                  <div className="card-body d-flex  align-items-center gap-5">
                    <i className="bi bi-currency-dollar fs-1 neon-icon"></i>
                    <div>
                      <h5 className="card-title fs-6">Doanh thu</h5>
                      <p className="card-text fs-5">
                        {doanhthus?.TongDoanhThu ? "Tổng : " + Number(doanhthus.TongDoanhThu).toLocaleString() : "Chưa có dữ liệu"} đ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
    
              {/* Thẻ Số vé đã bán */}
              <div className="col-md-4">
                <div className="card text-white bg-dark stats-card">
                  <div className="card-body d-flex align-items-center gap-5">
                    <i className="bi bi-credit-card-2-back fs-1 neon-icon"></i>                    
                    <div>
                      <h5 className="card-title fs-6">Số vé đã bán</h5>
                      <p className="card-text fs-5">
                         {tongVe?.TongVeDaBan ? "tổng : " + Number(tongVe.TongVeDaBan) : "Chưa có dữ liệu"} vé
                      </p>
                    </div>
                  </div>
                </div>
              </div>
    
              {/* Thẻ Số vé tồn kho */}
              <div className="col-md-4">
                <div className="card text-white bg-dark stats-card">
                  <div className="card-body d-flex align-items-center gap-5">
                    <i className="bi bi-ticket fs-1 neon-icon"></i>
                    <div>
                      <h5 className="card-title fs-6">Số vé tồn kho</h5>
                      <p className="card-text fs-5">
                        {/* {totalVeTonKho ? totalVeTonKho : "Chưa có dữ liệu"} vé */}
                        Chưa có dữ liệu
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    
            {/* Biểu đồ và nút chọn thời gian (giữ nguyên) */}
            <div className="card bg-dark text-white">
              <div className="card-body">
                <div className="d-flex justify-content-end mb-3">
                  <button
                    className={`btn btn-outline-secondary me-2 ${timeRange === "24 giờ" ? "active" : ""}`}
                    onClick={() => setTimeRange("24 giờ")}
                  >
                    24 giờ
                  </button>
                  <button
                    className={`btn btn-success ${timeRange === "30 ngày" ? "active" : ""}`}
                    onClick={() => setTimeRange("30 ngày")}
                  >
                    30 ngày
                  </button>
                </div>
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    
  );
}