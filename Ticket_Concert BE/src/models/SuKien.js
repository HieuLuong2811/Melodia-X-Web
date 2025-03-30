import pool from '../config/db.js';

// Lấy tất cả sự kiện
export const getAllSuKien = async () => {
    try {
        const [rows] = await pool.query("SELECT * FROM SuKien");
        return rows;
    } catch (error) {
        throw error;
    }
};

// Lấy sự kiện theo ID
export const getSuKienById = async (id) => {
    try {
        const [rows] = await pool.query("SELECT * FROM SuKien WHERE IDSuKien = ?", [id]);
        return rows[0]; 
    } catch (error) {
        throw error;
    }
};

// Thêm mới sự kiện
export const createSuKien = async (suKien) => {
    try {
        const sql = "INSERT INTO SuKien SET ?";
        const [result] = await pool.query(sql, suKien);
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

// Cập nhật sự kiện
export const updateSuKien = async (id, suKien) => {
    try {
        const sql = "UPDATE SuKien SET ? WHERE IDSuKien = ?";
        const [result] = await pool.query(sql, [suKien, id]);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

// Xóa sự kiện
export const deleteSuKien = async (id) => {
    try {
        const sql = "DELETE FROM SuKien WHERE IDSuKien = ?";
        const [result] = await pool.query(sql, [id]);
        return result.affectedRows; 
    } catch (error) {
        throw error;
    }
};
