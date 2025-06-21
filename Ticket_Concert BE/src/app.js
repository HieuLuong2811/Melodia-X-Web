import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Khởi tạo ứng dụng Express
dotenv.config();
const app = express();

import NguoiDungRouter from './routers/NguoiDung.js';
import loaiVeRoutes from './routers/LoaiVe.js';
import hoaDonRoutes from './routers/HoaDonMuaVe.js';
import loaiSuKienRoutes from './routers/LoaiSuKien.js';
import SuKienRoutes from './routers/SuKien.js';
import authRoutes from './routers/login.js';
import SuatDienRouters from './routers/SuatDien.js';
import HoaDonRouters from './routers/HoaDonMuaVe.js';
import ChiTietHoaDonRouters from './routers/ChiTietHoaDon.js';
import emailRoutes from './routers/emailRoutes.js';
import dashboardAdmin from './routers/dashboardRoutes.js'
import paymentRouter from './routers/payment.js';
import ThongTinThanhToanRouter from './routers/ThongTinThanhToan.js';
import ThanhVienRouter from './routers/ThanhVien.js';
import ThongBaoRouter from './routers/ThongBao.js';

// Cấu hình middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Định nghĩa các tuyến API
app.use('/api', NguoiDungRouter);
app.use('/api', hoaDonRoutes);
app.use('/api', ThanhVienRouter);
app.use('/api', loaiSuKienRoutes);
app.use('/api', SuKienRoutes);
app.use('/api', loaiVeRoutes);
app.use('/api', authRoutes);
app.use('/api', ChiTietHoaDonRouters);
app.use('/api', HoaDonRouters);
app.use('/api', SuatDienRouters);
app.use('/api', emailRoutes);
app.use('/api', paymentRouter);
app.use('/api', dashboardAdmin);
app.use('/api', ThongTinThanhToanRouter);
app.use('/api', ThongBaoRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`✅ Server đang chạy trên http://localhost:${PORT}`);
});

export const viteNodeApp = app;
