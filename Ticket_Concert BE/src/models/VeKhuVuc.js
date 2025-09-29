import pool from '../config/db.js';

// Lấy tất cả vé khu vực
export const getVeKhuVucList = async () => {
    const sql = `SELECT * FROM VeKhuVuc`;
    const [rows] = await pool.query(sql);
    return rows;
};

// Lấy vé theo ID
export const getVeKhuVucById = async (idVeGhe) => {
    const sql = `SELECT * FROM VeKhuVuc WHERE IDVeGhe = ?`;
    const [rows] = await pool.query(sql, [idVeGhe]);
    return rows[0];
};

// Lấy vé theo sự kiện
export const getVeKhuVucBySuKien = async (idSuKien) => {
    const sql = `SELECT * FROM VeKhuVuc WHERE IDSuKien = ?`;
    const [rows] = await pool.query(sql, [idSuKien]);
    return rows;
};

// Tạo vé khu vực mới
export const createVeKhuVuc = async (idVeGhe, veData, connection) => {
    const { IDLoaiVe, IDKhuVuc, IDSuatDien, IDSuKien} = veData;
    const sql = `
        INSERT INTO VeKhuVuc
        (IDVeGhe, IDLoaiVe, IDKhuVuc, IDSuatDien, IDSuKien)
        VALUES (?, ?, ?, ?, ?)
    `;
    await connection.query(sql, [idVeGhe, IDLoaiVe, IDKhuVuc, IDSuatDien, IDSuKien]);
    return idVeGhe;
};

// Cập nhật trạng thái vé
export const updateVeKhuVuc = async (idVeGhe, updateData) => {
    const { IDLoaiVe, IDKhuVuc } = updateData;
    const sql = `
        UPDATE VeKhuVuc
        SET  = ?, IDLoaiVe = ?, IDKhuVuc = ?
        WHERE IDVeGhe = ?
    `;
    await pool.execute(sql, [, IDLoaiVe, IDKhuVuc, idVeGhe]);
};

// Xóa vé
export const deleteVeKhuVuc = async (idVeGhe) => {
    const sql = `DELETE FROM VeKhuVuc WHERE IDVeGhe = ?`;
    const [result] = await pool.query(sql, [idVeGhe]);
    return result.affectedRows;
};

// Lấy số lượng vé theo trạng thái của 1 khu vực
export const countVeTheoKhuVuc = async (idKhuVuc) => {
    const sql = `SELECT COUNT(*) AS SoLuong FROM VeKhuVuc WHERE IDKhuVuc = ? AND  = ?`;
    const [rows] = await pool.query(sql, [idKhuVuc, ]);
    return rows[0].SoLuong;
};
