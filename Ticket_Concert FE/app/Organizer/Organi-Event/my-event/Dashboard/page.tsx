"use client";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import LeftSidebar from "../component/menu";
import TopSidebar from "@/components/topSide-Organizer";
// import dynamic from "next/dynamic";
import "./dashboard.css";
import "../../../style/Home.css"
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  ChartOptions,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

export default function Statistics() {
  const [timeRange, setTimeRange] = useState("30 ngày");

  const doanhThuData = Array(30).fill(0.25); 
  const veBanData = Array(30).fill(0); 

  const totalDoanhThu = 121210; 
  const totalVeBan = 0; 

  const chartData = {
    labels: Array.from({ length: 30 }, (_, i) => `Tháng 3 ${i + 1}`),
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

  const chartOptions : ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      y1: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Doanh thu",
        },
        min: 0,
        max: 5,
      },
      y2: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Số vé đã bán",
        },
        min: 0,
        max: 5,
        grid: {
          drawOnChartArea: false, 
        },
      },
      x: {
        title: {
          display: true,
          text: "Ngày",
        },
      },
    },
  };

  return (
    <div className="d-flex">
        <LeftSidebar />
        <div id="right" className="overflow-auto w-100">
            <TopSidebar title= "Sự kiện của tôi"/>
            <div className="container" style={{height : "max-content"}}>
                <div className="row mb-4">
                    {/* Thẻ Doanh thu */}
                    <div className="col-md-6">
                    <div className="card text-white bg-dark">
                        <div className="card-body d-flex align-items-center">
                        <div>
                            <h5 className="card-title">Doanh thu</h5>
                            <p className="card-text">{totalDoanhThu.toLocaleString()}đ</p>
                            <small>Tổng: {totalDoanhThu.toLocaleString()}đ</small>
                        </div>
                        <div className="text-center">
                            <div
                            style={{
                                width: "100px",
                                height: "100px",
                                border: "8px solid #ffc107",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#ffc107",
                            }}
                            >
                                <span style={{color : "rgb(34 197 94)"}}>0 %</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>

                    {/* Thẻ Số vé đã bán */}
                    <div className="col-md-6">
                    <div className="card text-white bg-dark">
                        <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="card-title">Số vé đã bán</h5>
                            <p className="card-text">{totalVeBan} vé</p>
                            <small>Tổng: {totalVeBan} vé</small>
                        </div>
                        <div className="text-center">
                            <div
                            style={{
                                width: "100px",
                                height: "100px",
                                border: "8px solid #ffc107",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#ffc107",
                            }}
                            >
                                <span style={{color : "rgb(34 197 94)"}}>0 %</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Biểu đồ và nút chọn thời gian */}
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
    
  );
}