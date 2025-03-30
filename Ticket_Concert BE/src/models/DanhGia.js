import pool from '../config/db.js';

// Lấy tất cả đánh giá
export const getAllDanhGia = async () => {
    try {
        const [rows] = await pool.execute('SELECT * FROM DanhGia');
        return rows;
    } catch (error) {
        throw error;
    }
};

// Lấy đánh giá theo ID
export const getDanhGiaByID = async (idDanhGia) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM DanhGia WHERE IDDanhGia = ?', [idDanhGia]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        throw error;
    }
};

// Thêm đánh giá mới
export const createDanhGia = async (idDanhGia, data) => {
    try {
        const { idSuKien, idNguoiDung, danhGia, nhanXet } = data;
        await pool.execute(
            'INSERT INTO DanhGia (IDDanhGia, IDSuKien, IDNguoiDung, DanhGia, NhanXet, ThoiGianPhanHoi) VALUES (?, ?, ?, ?, ?, NOW())',
            [idDanhGia, idSuKien, idNguoiDung, danhGia, nhanXet]
        );
        return idDanhGia;
    } catch (error) {
        throw error;
    }
};

// Cập nhật đánh giá
export const updateDanhGia = async (idDanhGia, data) => {
    try {
        const { danhGia, nhanXet } = data;
        await pool.execute(
            'UPDATE DanhGia SET DanhGia = ?, NhanXet = ? WHERE IDDanhGia = ?',
            [danhGia, nhanXet, idDanhGia]
        );
    } catch (error) {
        throw error;
    }
};

// Xóa đánh giá
export const deleteDanhGia = async (idDanhGia) => {
    try {
        await pool.execute('DELETE FROM DanhGia WHERE IDDanhGia = ?', [idDanhGia]);
    } catch (error) {
        throw error;
    }
};
