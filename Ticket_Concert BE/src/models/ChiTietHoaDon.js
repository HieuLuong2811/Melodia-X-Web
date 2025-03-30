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
export const createChiTietHoaDon = async (idChiTietHoaDon, data) => {
    try {
        const { idHoaDon, idLoaiVe, soLuong, giaTien, trangThaiVe } = data;
        await pool.execute(
            'INSERT INTO ChiTietHoaDon (IDChiTietHoaDon, IDHoaDon, IDLoaiVe, SoLuong, GiaTien, TrangThaiVe) VALUES (?, ?, ?, ?, ?, ?)',
            [idChiTietHoaDon, idHoaDon, idLoaiVe, soLuong, giaTien, trangThaiVe]
        );
        return idChiTietHoaDon;
    } catch (error) {
        throw error;
    }
};

