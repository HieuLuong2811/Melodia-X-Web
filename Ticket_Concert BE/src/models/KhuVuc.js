import pool from '../config/db.js';

// Hàm lấy tất cả khu vực
export const getAllKhuVuc = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT IDKhuVuc, TenKhuVuc, LoaiKhuVuc, LuongVeToiDa
      FROM KhuVuc
    `);
    return rows;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khu vực:', error);
    throw error;
  }
};

export const getKhuVucById = async (idKhuVuc) => {
  try {
    const [rows] = await pool.query(`
      SELECT IDKhuVuc, TenKhuVuc, LoaiKhuVuc, LuongVeToiDa
      FROM KhuVuc
      WHERE IDKhuVuc = ?
    `, [idKhuVuc]);
    return rows[0]; 
  } catch (error) {
    console.error(`Lỗi khi lấy khu vực với ID ${idKhuVuc}:`, error);
    throw error;
  }
};