import { findUserByEmail } from "../models/Login";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "3f7a9d8e2b4c1a5d6f8g0h2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0b1c2";

export const loginUser = async (req, res) => {
  try {
    const { Email, MatKhau } = req.body;
    if (!Email || !MatKhau) {
      return res.status(400).json({ error: "Email và mật khẩu không được để trống" });
    }

    // Tìm người dùng theo Email
    const user = await findUserByEmail(Email);
    const isValid = bcrypt.compare(MatKhau, user.MatKhau);

    if (!user || !isValid) {
      return res.status(401).json({ error: "Sai email hoặc mật khẩu" });
    }

    const token = jwt.sign({ IDNguoiDung: user.IDNguoiDung }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, userId: user.IDNguoiDung });
    } catch (error) {
    res.status(500).json({ error: "Lỗi khi đăng nhập" });
  }
};
