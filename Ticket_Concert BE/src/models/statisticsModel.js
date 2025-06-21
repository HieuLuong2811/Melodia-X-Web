import pool from '../config/db.js';

// Thẻ số liệu (Stat Cards)
export const getStats = async () => {
  const [totalAccounts] = await pool.query(`
    SELECT COUNT(*) AS totalAccounts 
    FROM NguoiDung 
    WHERE TrangThai = 'Hoạt động';
  `);

  const [totalEvents] = await pool.query(`
    SELECT COUNT(*) AS totalEvents 
    FROM SuKien 
    WHERE TrangThaiSuKien NOT IN ('Hủy');
  `);

  const [totalRevenue] = await pool.query(`
    SELECT SUM(TongTien) AS totalRevenue 
    FROM HoaDonMuaVe 
    WHERE NgayThanhToan IS NOT NULL;
  `);

  return {
    totalAccounts: totalAccounts[0].totalAccounts,
    totalEvents: totalEvents[0].totalEvents,
    totalRevenue: totalRevenue[0].totalRevenue || 0,
  };
};

// Doanh thu bán vé theo tháng (Revenue Stats)
export const getRevenueStats = async () => {
  const [rows] = await pool.query(`
    SELECT 
    DATE_FORMAT(NgayThanhToan, '%m/%Y') AS month,
    SUM(TongTien) AS total
      FROM HoaDonMuaVe
      WHERE NgayThanhToan IS NOT NULL
      GROUP BY DATE_FORMAT(NgayThanhToan, '%m/%Y')
      ORDER BY MIN(NgayThanhToan) ASC
      LIMIT 4;
  `);
  return rows;
};

// Sự kiện theo loại (Event Stats)
export const getEventStats = async () => {
  const [rows] = await pool.query(`
    SELECT 
      LSK.TenLoai AS type,
      COUNT(SK.IDSuKien) AS value
    FROM SuKien SK
    JOIN LoaiSuKien LSK ON SK.IDLoaiSuKien = LSK.IDLoaiSuKien
    WHERE SK.TrangThaiSuKien NOT IN ('Hủy')
    GROUP BY LSK.TenLoai;
  `);
  return rows;
};

// Danh sách sự kiện mới nhất (Recent Events)
export const getRecentEvents = async () => {
  const [rows] = await pool.query(`
    SELECT 
      SK.IDSuKien AS id,
      SK.TenSuKien AS name,
      DATE_FORMAT(SD.ThoiGianBatDau, '%d/%m/%Y') AS date,
      SUM(HD.TongTien) AS revenue
    FROM SuKien SK
    LEFT JOIN SuatDien SD ON SK.IDSuKien = SD.IDSuKien
    LEFT JOIN LoaiVe LV ON SD.IDSuatDien = LV.IDSuatDien
    LEFT JOIN ChiTietHoaDon CTHD ON LV.IDLoaiVe = CTHD.IDLoaiVe
    LEFT JOIN HoaDonMuaVe HD ON CTHD.IDHoaDon = HD.IDHoaDon
    WHERE SK.TrangThaiSuKien NOT IN ('Hủy')
    GROUP BY SK.IDSuKien, SK.TenSuKien, SD.ThoiGianBatDau
    ORDER BY SD.ThoiGianBatDau DESC
    LIMIT 5;
  `);
  return rows;
};

export const account = async () => {
  const [rows] = await pool.query(`
    SELECT 
      COUNT(*) AS totalAccounts 
    FROM NguoiDung 
    WHERE TrangThai = 'Hoạt động';
  `);
  return rows[0].totalAccounts;
}