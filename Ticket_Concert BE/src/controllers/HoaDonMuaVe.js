import { getAllHoaDon, getHoaDonByID, createHoaDon, fetchAllHoaDonChiTiet, deleteHoaDon,getHoaDonByIDSuatDien  } from '../models/HoaDonMuaVe.js';
import {createChiTietHoaDon} from '../models/ChiTietHoaDon.js';
import pool from '../config/db.js';
import { checkAndUpdateSoLuongVe } from '../models/LoaiVe.js';
import { v4 as uuidv4 } from 'uuid';

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
        soLuong: data.soLuong,
        giaTien: data.giaTien,
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
        try {
            await connection.beginTransaction();

            const HoaDonData = getHoaDonMuaVeData(req.body);
            const { chiTiet } = req.body;
            const idHoaDon = uuidv4();

            await createHoaDon(idHoaDon, HoaDonData, connection);

            const chiTietHoaDonList = getChiTietHoaDonData(chiTiet, idHoaDon);

            for (const chiTietItem of chiTietHoaDonList) {
                const idChiTietHoaDon = uuidv4();
                const { idLoaiVe, soLuong } = chiTietItem;

                await checkAndUpdateSoLuongVe(idLoaiVe, soLuong, connection);

                await createChiTietHoaDon(idChiTietHoaDon, chiTietItem, connection);
            }

            await connection.commit();
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
