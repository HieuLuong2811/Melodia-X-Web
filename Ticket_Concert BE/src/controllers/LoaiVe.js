import { getAllLoaiVe, getLoaiVeByID, getLoaiVeByIDSuatDien, getVeDaMuaByUserId, createLoaiVe, updateLoaiVe, deleteLoaiVe } from '../models/LoaiVe.js';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';

// Hàm lấy dữ liệu từ request body
const getLoaiVeData = (data) => ({
    IDSuatDien: data.IDSuatDien,
    TenVe: data.TenVe,
    AnhVe: data.AnhVe,
    GiaVe: data.GiaVe,
    SoLuongVe: data.SoLuongVe,
    SoLuongToiDaMotDon : data.SoLuongToiDaMotDon,
    ThongTinVe: data.ThongTinVe || null
});

const LoaiVeController = {
    // Lấy tất cả loại vé
    getLoaiVeCtrl: async (req, res) => {
        try {
            const loaiVeList = await getAllLoaiVe();
            res.json(loaiVeList);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy loại vé theo ID
    getLoaiVeByIDCtrl: async (req, res) => {
        try {
            const loaiVe = await getLoaiVeByID(req.params.idLoaiVe);
            if (loaiVe) res.json(loaiVe);
            else res.status(404).json({ message: 'Không tìm thấy loại vé' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getLoaiVeByIDSuatDienCtrl: async (req, res) => {
        try {
            const {idSuatDien} = req.params;
            const {idkhuVuc} = req.query;
            const suatdien = await getLoaiVeByIDSuatDien(idSuatDien, idkhuVuc);
            res.status(201).json(suatdien);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Thêm loại vé mới
    createLoaiVeCtrl: async (req, res) => {
        try {
            const connection = await pool.getConnection(); 
            await connection.beginTransaction(); 

            const loaiVeData = getLoaiVeData(req.body);
            const idLoaiVe = uuidv4();

        
            await createLoaiVe(idLoaiVe, loaiVeData, connection);

            await connection.commit(); 
            connection.release();

            res.status(201).json({ IDLoaiVe: idLoaiVe, ...loaiVeData });
        } catch (error) {
            await connection.rollback(); 
            connection.release();
            res.status(500).json({ message: error.message });
        }
    },

    updateLoaiVeCtrl: async (req, res) => {
        try {
        const loaiVeData = getLoaiVeData(req.body);
        const idLoaiVe = req.params.idLoaiVe;

        const affectedRows = await updateLoaiVe(idLoaiVe, loaiVeData);

        if (affectedRows) {
            const updated = await getLoaiVeByID(idLoaiVe);

            if (req.body.IDSuatDien) {
                io.to(req.body.IDSuatDien).emit("ticket_updated", updated);
            } else {
                io.emit("ticket_updated", updated);
            }

            res.json(updated);
        } else {
            res.status(404).json({ message: 'Không tìm thấy loại vé' });
        }
        } catch (error) {
        console.error("❌ Lỗi update LoaiVe:", error);
        res.status(500).json({ message: error.message });
        }
    },

    // Xóa loại vé
    deleteLoaiVeCtrl: async (req, res) => {
        try {
            const affectedRows = await deleteLoaiVe(req.params.idLoaiVe);
            if (affectedRows) res.json({ message: 'Xóa loại vé thành công' });
            else res.status(404).json({ message: 'Không tìm thấy loại vé' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getVeDaMuaByUserIdCtrl: async (req, res) => {
        try {
        const { idNguoiDung } = req.params;
        const veDaMua = await getVeDaMuaByUserId(idNguoiDung);
        
        res.status(200).json(veDaMua);
        } catch (error) {
        console.error('Lỗi khi lấy vé đã mua:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server. Không thể lấy dữ liệu vé đã mua.'
        });
        }
    }
};

export default LoaiVeController;
