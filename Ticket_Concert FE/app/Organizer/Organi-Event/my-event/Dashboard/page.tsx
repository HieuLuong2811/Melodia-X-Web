// pages/Statistics.tsx
"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
const LeftSidebar = dynamic(() => import("../component/menu.tsx").then(), { ssr: false });
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TopSidebar from "@/app/Organizer/component/topSide-Organizer.tsx";
import "./dashboard.css";
import "../../../style/Home.css";
import { SoLuongVe, DoanhThu } from "@/interfaces/DashBoard";
import {DisplayEventTime} from "@/components/DisplayEventTime";
import { LoaiVeService } from "@/services/LoaiVe";
import { SuatDien } from "@/interfaces/SuatDien";
import { SuatDienService } from "@/services/SuatDien";
import { dashboardService } from "@/services/DashBoard";
import dynamic from 'next/dynamic';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
const EmptyData = dynamic(() => import('@/components/emptydata'));import { Chart as ChartJS, LineElement,  CategoryScale, LinearScale, ChartOptions, PointElement, Title, Tooltip,Legend,} from "chart.js";
import { LoaiVe } from "@/interfaces/LoaiVe";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

export default function Statistics() {
  const [timeRange, setTimeRange] = useState<"24 giờ" | "30 ngày">("30 ngày");
  const [doanhthus, setDoanhthus] = useState<DoanhThu | null>(null);
  const [tongVe, setTongVe] = useState<SoLuongVe | null>(null);
  const [totalDoanhThu, setTotalDoanhThu] = useState<number>(0);
  const [totalVeBan, setTotalVeBan] = useState<number>(0);
  const [loaiVeTonKho, setLoaiVeTonKho] = useState<number>(0);

  const [suatDiens, setSuatDiens] = useState<SuatDien[]>([]);
  const [selectedSuatDienId, setSelectedSuatDienId] = useState<{
    IDSuatDien: string;
    ThoiGianBatDau: string;
    ThoiGianKetThuc: string;
  } | null>(null);
  

  const [loaiVe, setLoaiVe] = useState<LoaiVe[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventId = localStorage.getItem("IDSuKien_Organizer_Detail");
        if (!eventId) {
          return;
        }

        const suatDienData = await SuatDienService.getbyIDSuKien(eventId);
        if (suatDienData) {

          const suatDienArray = Array.isArray(suatDienData) ? suatDienData : [suatDienData];
          setSuatDiens(suatDienArray);

          if(selectedSuatDienId) {

            const doanhthu = await dashboardService.getdoanhthu(selectedSuatDienId.IDSuatDien);
            const luongve = await dashboardService.getVeDaBan(selectedSuatDienId.IDSuatDien);
            const soluongvetonkho = await dashboardService.getVeTonKho(selectedSuatDienId.IDSuatDien);

            setDoanhthus(doanhthu);
            setTongVe(luongve);
            setLoaiVeTonKho(Number(soluongvetonkho?.TongVeTonKho) || 0);

            const doanhThuValue = Number(doanhthu?.TongDoanhThu) || 0;
            const veBanValue = Number(luongve?.TongVeDaBan) || 0;
            const veTonKhoValue = Number(soluongvetonkho?.TongVeTonKho) || 0;

            setTotalDoanhThu(doanhThuValue);
            setTotalVeBan(veBanValue);
            setLoaiVeTonKho(veTonKhoValue);

            const IDSuatDien = selectedSuatDienId?.IDSuatDien || suatDienArray[0].IDSuatDien;
            const LoaiVes = await LoaiVeService.getLoaiVesByIdSuatDien(IDSuatDien);
            setLoaiVe(Array.isArray(LoaiVes) ? LoaiVes : [LoaiVes]);
          }
          else {
            setDoanhthus(null);
            setTongVe(null);
            setTotalDoanhThu(0);
            setTotalVeBan(0);
            setLoaiVe([]);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, [selectedSuatDienId]);

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const selected = JSON.parse(event.target.value);
    setSelectedSuatDienId(selected);
  };


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

  const renderOrdersTable = () => (
    <div>
      {loaiVe.length === 0 ? (
        <div className="d-flex flex-column text-center w-100 justify-content-center">
          <EmptyData />
          <Typography variant="h6" sx={{ mt: 3, color: '#ffffff', fontWeight: 'bold' }}>
            Chưa có loại vé nào cho buổi biểu diễn này
          </Typography>
        </div>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent'}}>
          <Table
            sx={{
              borderCollapse: 'separate',
              borderSpacing: '2px 2px'}}>
            <TableHead>
              <TableRow>
                {['Tên vé', 'Giá vé', 'Số lượng tồn kho', 'Số lượng tối đa trong một đơn'].map((header, i) => (
                  <TableCell key={i} align="center" sx={{ color: '#fff', backgroundColor: 'rgb(56, 56, 61)', borderBottom: 'none', fontWeight: 'bold', 
                    '&:first-of-type': {borderTopLeftRadius: '8px'},
                    '&:last-of-type': { borderTopRightRadius: '8px'}}}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loaiVe.map((loaive, index) => (
                <TableRow key={index} sx={{ backgroundColor: 'rgb(81, 81, 88)', borderRadius: '8px', '& td': { borderBottom: 'none'},  '&:hover': {backgroundColor: 'rgb(56, 56, 61)',}}}>
                  <TableCell align="center" sx={{ color: '#fff' }}>{loaive.TenVe}</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>
                    {loaive.GiaVe.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>{loaive.SoLuongVe}</TableCell>
                  <TableCell align="center" sx={{ color: '#fff' }}>{loaive.SoLuongToiDaMotDon}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );


  return (
    <>
      <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
      />
      <div className="d-flex">
        <LeftSidebar />
        <div id="right" className="overflow-auto w-100" style={{ background: "linear-gradient(rgb(15, 46, 29), rgb(30 10 30))" }}>
          <TopSidebar title="Chưa chọn suất diễn"/>
          <div className="container d-flex flex-column gap-5 py-4 px-3" style={{ minHeight: "100vh" }}>

            {/* Header Select */}
            <div className="p-3 text-white border-light" style={{borderBottom : "1px solid #0e0e0e"}}>
              <div className="row align-items-center">
                <div className="col-md-6 fs-5 d-flex align-items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="28" fill="none"><g clipPath="url(#Calendar-star_svg__a)"><path fill="#fff" fillRule="evenodd" d="M8 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1a4 4 0 0 1 4 4v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a4 4 0 0 1 4-4h1V3a1 1 0 0 1 1-1m4.514 8.32a.573.573 0 0 0-1.028 0l-.792 1.604a.57.57 0 0 1-.432.314l-1.77.257a.573.573 0 0 0-.318.978l1.281 1.25a.57.57 0 0 1 .165.506l-.302 1.764a.573.573 0 0 0 .831.605l1.584-.833a.57.57 0 0 1 .534 0l1.584.832a.573.573 0 0 0 .831-.604l-.302-1.763a.57.57 0 0 1 .165-.508l1.281-1.249a.573.573 0 0 0-.318-.978l-1.77-.257a.57.57 0 0 1-.432-.314z" clipRule="evenodd"></path></g><defs><clipPath id="Calendar-star_svg__a"><path fill="#fff" d="M2 2h20v20H2z"></path></clipPath></defs></svg>                  
                  {selectedSuatDienId ? (
                    <DisplayEventTime start={selectedSuatDienId.ThoiGianBatDau} end={selectedSuatDienId.ThoiGianKetThuc} />
                  ) : (
                    <span className="d-flex align-items-center">Chọn suất diễn <i className="bi bi-arrow-right-short"></i></span>
                  )}
                </div>
                <div className="col-md-6 text-end">
                  <Select id="suatDienSelect"
                    sx={{ color: 'white', width : "350px", border: '1px solid white', borderRadius: '5px',
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                    }}
                     value={selectedSuatDienId ? JSON.stringify(selectedSuatDienId) : ''}
                      onChange={handleSelectChange}>
                    {suatDiens.map((suatDien) => (
                      <MenuItem key={suatDien.IDSuatDien} value={JSON.stringify(suatDien)}>
                        <DisplayEventTime start={suatDien.ThoiGianBatDau} end={suatDien.ThoiGianKetThuc} />
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-white mb-3">Doanh thu - Tổng quan</h5>
              <div className="row g-4">
                {[{
                  title: "Doanh thu",
                  icon: "bi-currency-dollar",
                  value: doanhthus?.TongDoanhThu ? Number(doanhthus.TongDoanhThu).toLocaleString() + " đ" : "Chưa có dữ liệu",
                },{
                  title: "Số vé đã bán",
                  icon: "bi-credit-card-2-back",
                  value: tongVe?.TongVeDaBan ? `${Number(tongVe.TongVeDaBan)} vé` : "Chưa có dữ liệu",
                },{
                  title: "Số vé tồn kho",
                  icon: "bi-ticket",
                  value: loaiVeTonKho ? `${Number(loaiVeTonKho)} vé` : "Chưa có dữ liệu", 
                }].map((item, i) => (
                  <div key={i} className="col-md-4">
                    <div className="card text-white h-100 p-3 rounded shadow-sm">
                      <div className="d-flex align-items-center gap-4">
                        <i className={`bi ${item.icon} fs-1`}></i>
                        <div>
                          <h5 className="fs-6 mb-1">{item.title}</h5>
                          <div className="d-flex align-items-center gap-1">
                            <span>Tổng : </span>
                            <p className="fs-5 mb-0 fs-bold">{item.value}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Section */}
            <div className="text-white border-light rounded">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Biểu đồ doanh thu</h5>
                <div>
                  <button className={`btn btn-outline-light me-2 ${timeRange === "24 giờ" ? "active" : ""}`}
                    onClick={() => setTimeRange("24 giờ")}>
                    24 giờ
                  </button>
                  <button className={`btn btn-outline-success ${timeRange === "30 ngày" ? "active" : ""}`}
                    onClick={() => setTimeRange("30 ngày")}>
                    30 ngày
                  </button>
                </div>
              </div>
              <Line data={chartData} options={chartOptions} />
            </div>

            {/* Table Section */}
            <div className="text-white border-light rounded ">
              <h5 className="mb-3">Lượng vé tồn kho</h5>
              {renderOrdersTable()}
            </div>
          </div>

        </div>
      </div>
    </>
    
  );
}