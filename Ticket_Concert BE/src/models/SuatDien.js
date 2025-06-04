import pool from '../config/db.js';

// Lấy tất cả suất diễn
export const getAllSuatDien = async () => {
    try {
        const [rows] = await pool.execute('SELECT * FROM SuatDien');
        return rows;
    } catch (error) {
        throw error;
    }
};

// Lấy suất diễn theo ID
export const getSuatDienByID = async (idSuKien) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM SuatDien WHERE IDSuKien = ?', [idSuKien]);
        return rows;
    } catch (error) {
        throw error;
    }
};

// Tạo nhiều suất diễn
export const createSuatDien = async (idSuatDien, data, connection) => {
    try {
        const { idSuKien, thoiGianBatDau, thoiGianKetThuc } = data;
        const query =
            'INSERT INTO SuatDien (IDSuatDien, IDSuKien, ThoiGianBatDau, ThoiGianKetThuc) VALUES (?, ?, ?, ?)';
        await connection.query(query, [idSuatDien, idSuKien, thoiGianBatDau, thoiGianKetThuc]);       
        return idSuatDien;
    } catch (error) {
        throw error;
    }
};


// Cập nhật suất diễn
export const updateSuatDien = async (idSuatDien, data) => {
    try {
        const { idSuKien, thoiGianBatDau, thoiGianKetThuc } = data;
        await pool.execute(
            'UPDATE SuatDien SET IDSuKien = ?, ThoiGianBatDau = ?, ThoiGianKetThuc = ? WHERE IDSuatDien = ?',
            [idSuKien, thoiGianBatDau, thoiGianKetThuc, idSuatDien]
        );
    } catch (error) {
        throw error;
    }
};

// Xóa suất diễn
export const deleteSuatDien = async (idSuatDien) => {
    try {
        await pool.execute('DELETE FROM SuatDien WHERE IDSuatDien = ?', [idSuatDien]);
    } catch (error) {
        throw error;
    }
};
