import { getAllHoaDon, getHoaDonByID, createHoaDon, fetchAllHoaDonChiTiet, deleteHoaDon,getHoaDonByIDSuatDien, updateHoaDon  } from '../models/HoaDonMuaVe.js';
import {createChiTietHoaDon} from '../models/ChiTietHoaDon.js';
import pool from '../config/db.js';
import { checkAndUpdateSoLuongVe, returnLoaiVe, getLoaiVeByID } from '../models/LoaiVe.js';
import { v4 as uuidv4 } from 'uuid';
import ThongBaoModel from '../models/ThongBao.js';
import { sendNotificationToUser } from '../models/notificationServiceSocket.js';
import { io } from '../app.js';

const getHoaDonMuaVeData = (hoaDon) => ({
    idNguoiDung: hoaDon.idNguoiDung,
    tongSoVe: hoaDon.tongSoVe,
    ngayThanhToan: new Date(), 
    tongTien: hoaDon.tongTien,
    phuongThucThanhToan: hoaDon.phuongThucThanhToan,
    trangThaiThanhToan: hoaDon.trangThaiThanhToan || 'Chưa thanh toán'
});


const getChiTietHoaDonData = (chiTietList, idHoaDon) => {
    return chiTietList.map((data) => ({
        idHoaDon: idHoaDon,
        idLoaiVe: data.idLoaiVe,
        tenKhuVuc: data.tenKhuVuc,
        soLuong: data.soLuong,
        giaTien: parseFloat(data.giaTien),
        trangThaiVe: data.trangThaiVe
    }));
};

const HoaDonMuaVeController = {
    // Lấy danh sách tất cả hóa đơn
    getAllHoaDonCtrl: async (req, res) => {
        try {
            const hoaDonList = await getAllHoaDon();
            res.json(hoaDonList);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy hóa đơn theo ID
    getHoaDonByIDCtrl: async (req, res) => {
        try {
            const hoaDon = await getHoaDonByID(req.params.idHoaDon);
            if (hoaDon) res.json(hoaDon);
            else res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateHoaDonCtrl: async (idHoaDon) => {
        try {
            const hoaDon = await updateHoaDon(idHoaDon);
            if (hoaDon) return console.log('Cập nhật hóa đơn thanh cong');
            else console.error('Không tìm thấy hóa đơn');
        } catch (error) {
            console.error('Lỗi khi cập nhật hóa đơn:', error);
        }
    },

    getHoaDonByIDsuatdienCtrl: async (req, res) => {
        try {
            const hoaDon = await getHoaDonByIDSuatDien(req.params.idSuatDien);
            if (hoaDon) res.json(hoaDon);
            else res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteHoaDonCtrl: async (req, res) => {
        try {
            const result = await deleteHoaDon(req.params.idHoaDon);  
            if (result.affectedRows > 0) {
                res.json({ message: "Xoá hoá đơn thành công" });
            } else {
                res.status(400).json({ message: "Không tìm thấy hoá đơn" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // tạo hóa đơn và chi tiết hóa đơn
    createHoaDonWithDetailsCtrl: async (req, res) => {
        const connection = await pool.getConnection();
        let chiTietHoaDonList = []; 
        const updatedTickets = [];
        try {
            await connection.beginTransaction();

            const HoaDonData = getHoaDonMuaVeData(req.body);
            const { chiTiet } = req.body;
            const idHoaDon = uuidv4();

            await createHoaDon(idHoaDon, HoaDonData, connection);

            chiTietHoaDonList = getChiTietHoaDonData(chiTiet, idHoaDon);

            for (const chiTietItem of chiTietHoaDonList) {
                const idChiTietHoaDon = uuidv4();
                const { idLoaiVe, soLuong } = chiTietItem;

                await checkAndUpdateSoLuongVe(idLoaiVe, soLuong, connection);
                updatedTickets.push(idLoaiVe);
                await createChiTietHoaDon(idChiTietHoaDon, chiTietItem, connection);
            }

            const msg = {
                tieuDe: 'Mua vé thành công',
                noiDung: `Đặt vé thành công. Vui lòng kiểm tra giỏ hàng và chi tiết loại vé`,
                ngayTao: new Date(),
                trangThai: 'Chưa đọc'
            };

            await ThongBaoModel.createThongBao(idHoaDon, {idNguoiDung: HoaDonData.idNguoiDung ,  ...msg});

            sendNotificationToUser(HoaDonData.idNguoiDung, msg);
            
            await connection.commit();

            for (const idLoaiVe of updatedTickets) {
            const updatedTicket = await getLoaiVeByID(idLoaiVe);
            io.emit("ticket_updated", {
                IDLoaiVe: updatedTicket.IDLoaiVe,
                SoLuongVe: updatedTicket.SoLuongVe,
                IDSuKien: updatedTicket.IDSuKien,
            });
            }
            res.status(201).json({ message: "Tạo hóa đơn và chi tiết hóa đơn thành công", idHoaDon, tongTien: HoaDonData.tongTien });
        } catch (error) {
            await connection.rollback();
            
            for (const chiTietItem of chiTietHoaDonList) {
                const { idLoaiVe, soLuong } = chiTietItem;
                await returnLoaiVe(idLoaiVe, soLuong, connection);
            }

            res.status(500).json({ message: error.message });
        } finally {
            connection.release();
        }
    },

    fetchAllHoaDonChiTietCtrl: async (req, res) => {
        try {
            const result = await fetchAllHoaDonChiTiet();
            res.json(result);
        } catch (error) {
            console.error("Lỗi khi lấy hóa đơn chi tiết:", error);
            res.status(500).json({ message: error.message });
        }
    },
};

export default HoaDonMuaVeController;
