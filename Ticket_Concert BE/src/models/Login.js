import pool from "../config/db.js";

export const findUserByEmail = async (Email) => {
  const [rows] = await pool.query("SELECT * FROM NguoiDung WHERE Email = ?", [Email]);
  const user = rows[0];

  if (!user) return null;

  if (user.TrangThai === 'Khoá') {
    return { locked: true, message: "Tài khoản của bạn đã bị khoá. Vui lòng liên hệ số hotline: 0123 456 789 để biết thêm chi tiết." };
  }

  return user;
};

export const findUserByEmailOrPhone = async (email, phone) => {
  const [user] = await pool.query(
    "SELECT * FROM NguoiDung WHERE Email = ? OR SoDienThoai = ?",
    [email, phone]
  );
  return user;
};


export const createUser = async (user) => {
  const {
      IDNguoiDung,
      TenNguoiDung,
      Email,
      SoDienThoai,
      GioiTinh,
      NgaySinh,
      MatKhau
  } = user;

  await pool.query(
      `INSERT INTO NguoiDung 
      (IDNguoiDung, TenNguoiDung, Email, SoDienThoai, GioiTinh, NgaySinh, MatKhau, QuyenHan, TrangThai)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'User', 'Hoạt động')`,
      [
          IDNguoiDung,
          TenNguoiDung,
          Email,
          SoDienThoai,
          GioiTinh || null,
          NgaySinh || null,
          MatKhau,
      ]
  );
};