import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './dashboard.css'
import {getDashboardStats, getRecentEvents,fetchAccHoatDong} from "@/services/dashboardService";
import { StatsResponse, RecentEvent, AccHoatDong} from "@/interfaces/Statistics";

const Dashboard = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [events, setEvents] = useState<RecentEvent[]>([]);
  const [accHoatDong, setAccHoatDong] = useState<AccHoatDong[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const dashboardStats = await getDashboardStats();
      const recentEvents = await getRecentEvents();
      const accHoatDongData = await fetchAccHoatDong();
      setStats(dashboardStats);
      setAccHoatDong(accHoatDongData);
      setEvents(recentEvents);
    };

    fetchData();
  }, []);

  
  if (!stats) {
    return <div>Loading...</div>;
  }
  return (
    <div className="mt-4">
      {/* Stat Cards */}
      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className=" text-primary text-uppercase mb-1">
                              Tổng tài khoản</div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalAccounts}</div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-person-fill fs-1 text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className=" text-primary text-uppercase mb-1">
                              Tài khoản hoạt động
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">{accHoatDong.toLocaleString()}</div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-calendar fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className=" text-primary text-uppercase mb-1">
                              Tổng sự kiện
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalEvents}</div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-calendar fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-custom shadow h-100 py-2">
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className=" text-primary text-uppercase mb-1">
                              Doanh thu tổng
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">  
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue)}
                            </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Danh sách sự kiện mới nhất</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Tên sự kiện</th>
                <th>Ngày tạo</th>
                <th>Ngày kết thúc</th>
                <th>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr  key={`${event.id}-${index}`}>
                  <td>{event.name}</td>
                  <td>{event.date}</td>
                  <td>{event.date}</td>
                  <td>{event.revenue.toLocaleString()} VNĐ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
