import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ThongBaoRealTime } from './cron/ThongBao.js'

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
import dashboardAdmin from './routers/dashboardRoutes.js';
import paymentRouter from './routers/payment.js';
import ThongTinThanhToanRouter from './routers/ThongTinThanhToan.js';
import ThanhVienRouter from './routers/ThanhVien.js';
import ThongBaoRouter from './routers/ThongBao.js';
import KhuVucRouter from './routers/KhuVuc.js';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api', KhuVucRouter);
ThongBaoRealTime();

const PORT = process.env.PORT || 3000;

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }
});

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("join_room", async (userId) => {
    socket.join(userId);
    console.log(`✅ ${socket.id} joined room ${userId}`);
  });

  socket.on("create_notification", async ({ userId, noti }) => {
    io.to(userId).emit("new_notification", saved);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server đang chạy trên http://localhost:${PORT}`);
});

export const viteNodeApp = app;
