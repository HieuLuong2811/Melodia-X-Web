import pool from '../config/db.js';

// Lấy tất cả chi tiết hóa đơn
export const getAllChiTietHoaDon = async () => {
    try {
        const [rows] = await pool.execute('SELECT * FROM ChiTietHoaDon');
        return rows;
    } catch (error) {
        throw error;
    }
};

// Lấy chi tiết hóa đơn theo ID
export const getChiTietHoaDonByID = async (idChiTietHoaDon) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM ChiTietHoaDon WHERE IDChiTietHoaDon = ?', [idChiTietHoaDon]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        throw error;
    }
};

// Thêm chi tiết hóa đơn mới
export const createChiTietHoaDon = async (id, data, connection = pool) => {
  const { idHoaDon, idLoaiVe, soLuong, giaTien, trangThaiVe } = data;
  const [rows] = await connection.query(`
    INSERT INTO ChiTietHoaDon (IDChiTietHoaDon, IDHoaDon, IDLoaiVe, SoLuong, GiaTien, TrangThaiVe)
    VALUES (?, ?, ?, ?, ?, ?)`, 
    [id, idHoaDon, idLoaiVe, soLuong, giaTien, trangThaiVe]
  );
  return rows;
};


