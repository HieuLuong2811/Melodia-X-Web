import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const getNguoiDungData = (nguoiDung) => {
    return [
        nguoiDung.hinhAnh,
        nguoiDung.tenNguoiDung,
        nguoiDung.email,
        nguoiDung.soDienThoai,
        nguoiDung.gioiTinh,
        nguoiDung.ngaySinh,
        nguoiDung.matKhau,
        nguoiDung.quyenHan,
        nguoiDung.trangThai
    ];
};

export const getAllNguoiDung = async () => {
    const [rows] = await pool.query('SELECT * FROM NguoiDung');
    return rows;
};

export const getNguoiDungByID = async (idNguoiDung) => {
    const [rows] = await pool.query('SELECT * FROM NguoiDung WHERE idNguoiDung = ?', [idNguoiDung]);
    return rows[0];
};

export const createNguoiDung = async (idNguoiDung, nguoiDung) => {
    const userData = getNguoiDungData(nguoiDung);
    const [result] = await pool.query(
        `INSERT INTO NguoiDung (IDNguoiDung, HinhAnh, TenNguoiDung, Email, SoDienThoai, GioiTinh, NgaySinh, MatKhau, QuyenHan, TrangThai) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Hoạt động')`,
        [idNguoiDung, ...userData]
    );

    return idNguoiDung;
};

export const updateNguoiDung = async (IDNguoiDung, nguoiDung) => {
    const userData = getNguoiDungData(nguoiDung);

    if (userData[6]) { 
        userData[6] = await bcrypt.hash(userData[6], 10);
    }

    await pool.query(
        `UPDATE NguoiDung 
         SET HinhAnh = ?, TenNguoiDung = ?, Email = ?, SoDienThoai = ?, GioiTinh = ?, NgaySinh = ?, MatKhau = ?, QuyenHan = ?, TrangThai = ? 
         WHERE IDNguoiDung = ?`,
        [...userData, IDNguoiDung]
    );
};

export const deleteNguoiDung = async (idNguoiDung) => {
    await pool.query('DELETE FROM NguoiDung WHERE idNguoiDung = ?', [idNguoiDung]);
};

export const updateTrangThaiNguoiDung = async (idNguoiDung, trangThai) => {
    try{
        const sql = "UPDATE NguoiDung SET TrangThai = ? WHERE IDNguoiDung = ?";
        const [result] = await pool.query(sql, [trangThai, idNguoiDung]);
        return result.affectedRows[0];
    }catch (error) {
        throw error;
    }
};
