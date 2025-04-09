import pool from '../config/db.js';
import bcrypt from 'bcrypt';

const getNguoiDungData = (nguoiDung) => {
    return [
        nguoiDung.hinhAnh,
        nguoiDung.tenNguoiDung,
        nguoiDung.email,
        nguoiDung.soDienThoai,
        nguoiDung.gioiTinh,
        nguoiDung.ngaySinh,
        nguoiDung.matKhau, // Đây sẽ là mật khẩu chưa băm, sẽ được xử lý trước khi lưu
        nguoiDung.quyenHan,
        nguoiDung.trangThai
    ];
};

// Lấy danh sách người dùng
export const getAllNguoiDung = async () => {
    const [rows] = await pool.query('SELECT * FROM NguoiDung');
    return rows;
};

// Lấy người dùng theo ID
export const getNguoiDungByID = async (idNguoiDung) => {
    const [rows] = await pool.query('SELECT * FROM NguoiDung WHERE idNguoiDung = ?', [idNguoiDung]);
    return rows[0];
};

// Tạo người dùng mới
export const createNguoiDung = async (idNguoiDung, nguoiDung) => {
    const userData = getNguoiDungData(nguoiDung);
    const [result] = await pool.query(
        `INSERT INTO NguoiDung (IDNguoiDung, HinhAnh, TenNguoiDung, Email, SoDienThoai, GioiTinh, NgaySinh, MatKhau, QuyenHan, TrangThai) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [idNguoiDung, ...userData]
    );

    return idNguoiDung;
};

// Cập nhật người dùng
export const updateNguoiDung = async (IDNguoiDung, nguoiDung) => {
    const userData = getNguoiDungData(nguoiDung);

    // Băm mật khẩu nếu có thay đổi
    if (userData[6]) { // Kiểm tra xem mật khẩu có được cung cấp không
        userData[6] = await bcrypt.hash(userData[6], 10);
    }

    await pool.query(
        `UPDATE NguoiDung 
         SET HinhAnh = ?, TenNguoiDung = ?, Email = ?, SoDienThoai = ?, GioiTinh = ?, NgaySinh = ?, MatKhau = ?, QuyenHan = ?, TrangThai = ? 
         WHERE IDNguoiDung = ?`,
        [...userData, IDNguoiDung]
    );
};

// Xóa người dùng
export const deleteNguoiDung = async (idNguoiDung) => {
    await pool.query('DELETE FROM NguoiDung WHERE idNguoiDung = ?', [idNguoiDung]);
};