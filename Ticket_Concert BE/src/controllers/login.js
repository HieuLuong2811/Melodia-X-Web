// controllers/LoginController.js
import { findUserByEmail } from "../models/Login.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const loginUser = async (req, res) => {
    try {
        const { Email, MatKhau } = req.body;

        if (!Email || !MatKhau) {
            return res.status(400).json({ error: "Email và mật khẩu không được để trống" });
        }

        const user = await findUserByEmail(Email);
        if (!user) {
            return res.status(401).json({ error: "Sai email hoặc mật khẩu" });
        }
        
        const isValid = await bcrypt.compare(MatKhau, user.MatKhau);

        if (!isValid) {
            return res.status(401).json({ error: "Sai email hoặc mật khẩu" });
        }

        const token = jwt.sign(
            { IDNguoiDung: user.IDNguoiDung, QuyenHan: user.QuyenHan },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            token,
            userId: user.IDNguoiDung,
            avatar: user.HinhAnh,
        });
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        return res.status(500).json({ error: "Lỗi khi đăng nhập" });
    }
};
  