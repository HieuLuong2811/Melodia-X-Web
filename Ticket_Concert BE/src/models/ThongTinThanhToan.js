import pool from '../config/db.js';

// Lấy tất cả thông tin thanh toán
export const getAllThongTinThanhToan = async () => {
    try {
        const [rows] = await pool.execute('SELECT * FROM ThongTinThanhToan');
        return rows;
    } catch (error) {
        throw error;
    }
};

// Lấy thông tin thanh toán theo ID
export const getThongTinThanhToanByID = async (idNguoiDung) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM ThongTinThanhToan WHERE IDNguoiDung = ?', [idNguoiDung]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        throw error;
    }
};

// Thêm thông tin thanh toán mới
export const createThongTinThanhToan = async (idThongTin, data) => {
    try {
        const { idNguoiDung, chuTaiKhoan, soTaiKhoan, tenNganHang, chiNhanh, loaiHinh } = data;
        await pool.execute(
            'INSERT INTO ThongTinThanhToan (IDThongTin, IDNguoiDung, ChuTaiKhoan, SoTaiKhoan, TenNganHang, ChiNhanh, LoaiHinh) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [idThongTin, idNguoiDung, chuTaiKhoan, soTaiKhoan, tenNganHang, chiNhanh, loaiHinh]
        );
        return idThongTin;
    } catch (error) {
        throw error;
    }
};

// Cập nhật thông tin thanh toán
export const updateThongTinThanhToan = async (idThongTin, data) => {
    try {
        const { chuTaiKhoan, soTaiKhoan, tenNganHang, chiNhanh, loaiHinh } = data;
        await pool.execute(
            'UPDATE ThongTinThanhToan SET ChuTaiKhoan = ?, SoTaiKhoan = ?, TenNganHang = ?, ChiNhanh = ?, LoaiHinh = ? WHERE IDThongTin = ?',
            [chuTaiKhoan, soTaiKhoan, tenNganHang, chiNhanh, loaiHinh, idThongTin]
        );
    } catch (error) {
        throw error;
    }
};

// Xóa thông tin thanh toán
export const deleteThongTinThanhToan = async (idThongTin) => {
    try {
        await pool.execute('DELETE FROM ThongTinThanhToan WHERE IDThongTin = ?', [idThongTin]);
    } catch (error) {
        throw error;
    }
};
