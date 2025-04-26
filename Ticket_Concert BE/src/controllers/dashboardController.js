// controllers/dashboardController.js
import { getStats, getRevenueStats, getEventStats, getRecentEvents, account } from '../models/statisticsModel';

import { getDoanhThuBySuKien, getSoLuongVeDaBanBySuKien } from '../models/dashboard.js';

export const DoanhThu = async (req, res) => {
  try {
    const { idsukien } = req.params;
    const doanhThu = await getDoanhThuBySuKien(idsukien);
    res.json(doanhThu);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy doanh thu sự kiện", error: error.message });
  }
};

export const SoLuongVe = async (req, res) => {
  try {
    const { idsukien } = req.params;
    const soLuong = await getSoLuongVeDaBanBySuKien(idsukien);
    res.json(soLuong);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy số lượng vé đã bán", error: error.message });
  }
};

export const countacc = async (req, res) => {
  try {
    const soLuong = await account();
    res.json(soLuong);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy số lượng vé đã bán", error: error.message });
  }
}; 

const dashboardController = {
  getStats: async (req, res) => {
    try {
      const stats = await getStats();
      res.json(stats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Lỗi khi lấy số liệu thống kê' });
    }
  },

  getRevenueStats: async (req, res) => {
    try {
      const revenueData = await getRevenueStats();
      const labels = revenueData.map(row => row.month);
      const data = revenueData.map(row => parseFloat(row.total));
      res.json({
        labels,
        datasets: [{ label: 'Doanh thu (VND)', data, backgroundColor: '#8884d8' }],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Lỗi khi lấy doanh thu theo tháng' });
    }
  },

  // getTicketStats: async (req, res) => {
  //   try {
  //     const ticketData = await getTicketStats();
  //     const labels = ticketData.map(row => row.status);
  //     const data = ticketData.map(row => parseInt(row.value));
  //     const backgroundColor = ['#ff7f50', '#00c49f', '#ffbb28']; 
  //     res.json({
  //       labels,
  //       datasets: [{ label: 'Tình trạng vé', data, backgroundColor }],
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Lỗi khi lấy tình trạng vé' });
  //   }
  // },

  getEventStats: async (req, res) => {
    try {
      const eventData = await getEventStats();
      const labels = eventData.map(row => row.type);
      const data = eventData.map(row => parseInt(row.value));
      res.json({
        labels,
        datasets: [{ label: 'Sự kiện', data, backgroundColor: '#82ca9d' }],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Lỗi khi lấy sự kiện theo loại' });
    }
  },

  getRecentEvents: async (req, res) => {
    try {
      const events = await getRecentEvents();
      const formattedEvents = events.map(event => ({
        id: event.id,
        name: event.name,
        date: event.date,
        revenue: parseFloat(event.revenue) || 0,
      }));
      res.json(formattedEvents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Lỗi khi lấy danh sách sự kiện mới nhất' });
    }
  },
};

export default dashboardController;