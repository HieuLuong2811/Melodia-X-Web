// controllers/LoginController.js
import { findUserByEmail,createUser,findUserByEmailOrPhone  } from "../models/Login.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const LoginController = {
    loginUser: async (req, res) => {
        try {
            const { Email, MatKhau } = req.body;

            if (!Email || !MatKhau) {
                return res.status(400).json({ error: "Email và mật khẩu không được để trống" });
            }

            const user = await findUserByEmail(Email);
            if (!user) {
                return res.status(401).json({ error: "Không tồn tại tài khoản"});
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
                QuyenHan: user.QuyenHan,
                TrangThai: user.TrangThai
            });
        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error);
            return res.status(500).json({ error: "Lỗi khi đăng nhập" });
        }
    },

    registerUser: async (req, res) => {
        try {
            const { TenNguoiDung, Email, SoDienThoai, GioiTinh, NgaySinh, MatKhau } = req.body;

            if (!TenNguoiDung || !Email || !SoDienThoai || !MatKhau) {
                return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin bắt buộc" });
            }

            const existing = await findUserByEmailOrPhone(Email, SoDienThoai);
            if (existing.length > 0) {
                return res.status(409).json({ error: "Email hoặc số điện thoại đã tồn tại" });
            }

            const hashedPassword = await bcrypt.hash(MatKhau, 10);
            const IDNguoiDung = uuidv4();

            await createUser({
                IDNguoiDung,
                TenNguoiDung,
                Email,
                SoDienThoai,
                GioiTinh,
                NgaySinh,
                MatKhau: hashedPassword
            });

            res.status(201).json({ message: "Đăng ký thành công!" });
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            res.status(500).json({ error: "Lỗi khi đăng ký" });
        }
    },
}

export default LoginController;