import pool from '../config/db.js';

// Lấy tất cả thành viên
export const getAllThanhVien = async () => {
    try {
        const [rows] = await pool.execute('SELECT * FROM ThanhVien');
        return rows;
    } catch (error) {
        throw error;
    }
};

// Lấy thành viên theo ID
export const getThanhVienByID = async (idThanhVien) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM ThanhVien WHERE IDThanhVien = ?', [idThanhVien]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        throw error;
    }
};

// Thêm thành viên mới
export const createThanhVien = async (idThanhVien, data) => {
    try {
        const { idSuKien, tenThanhVien, vaiTro } = data;
        await pool.execute(
            'INSERT INTO ThanhVien (IDThanhVien, IDSuKien, TenThanhVien, Email, VaiTro) VALUES (?, ?, ?, ?, ?)',
            [idThanhVien, idSuKien, tenThanhVien, vaiTro]
        );
        return idThanhVien;
    } catch (error) {
        throw error;
    }
};

// Cập nhật thông tin thành viên
export const updateThanhVien = async (idThanhVien, data) => {
    try {
        const { idSuKien, tenThanhVien, vaiTro } = data;
        await pool.execute(
            'UPDATE ThanhVien SET IDSuKien = ?, TenThanhVien = ?, Email = ?, VaiTro = ? WHERE IDThanhVien = ?',
            [idSuKien, tenThanhVien, vaiTro, idThanhVien]
        );
    } catch (error) {
        throw error;
    }
};

// Xóa thành viên
export const deleteThanhVien = async (idThanhVien) => {
    try {
        await pool.execute('DELETE FROM ThanhVien WHERE IDThanhVien = ?', [idThanhVien]);
    } catch (error) {
        throw error;
    }
};
