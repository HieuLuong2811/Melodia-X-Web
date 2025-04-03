import { findUserByEmail } from "../models/Login";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { Email, MatKhau } = req.body;
    if (!Email || !MatKhau) {
      return res.status(400).json({ error: "Email và mật khẩu không được để trống" });
    }

   
    const user = await findUserByEmail(Email);
    const isValid = bcrypt.compare(MatKhau, user.MatKhau);

    if (!user || !isValid) {
      return res.status(401).json({ error: "Sai email hoặc mật khẩu" });
    }

    const token = jwt.sign({ IDNguoiDung: user.IDNguoiDung, QuyenHan : user.QuyenHan }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, userId: user.IDNguoiDung, avatar : user.HinhAnh , name: user.TenNguoiDung });
    } catch (error) {
    res.status(500).json({ error: "Lỗi khi đăng nhập" });
  }
};
