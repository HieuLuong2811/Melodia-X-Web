import pool from "../config/db.js";

export const findUserByEmail = async (Email) => {
  const [rows] = await pool.query("SELECT * FROM NguoiDung WHERE Email = ?", [Email]);
  return rows[0] || null;
};

