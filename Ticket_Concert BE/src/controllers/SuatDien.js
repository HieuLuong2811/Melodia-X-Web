import { getAllSuatDien, getSuatDienByID, createSuatDien, updateSuatDien, deleteSuatDien } from '../models/SuatDien.js';
import { v4 as uuidv4 } from 'uuid';

// Xử lý dữ liệu từ request body
const getSuatDienData = (data) => ({
    idSuKien: data.IDSuKien,
    thoiGianBatDau: data.ThoiGianBatDau,
    thoiGianKetThuc: data.ThoiGianKetThuc

});

const SuatDienController = {

    // Lấy tất cả suất diễn
    getAllSuatDiensCtrl: async (req, res) => {
        try {
            const data = await getAllSuatDien();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy suất diễn theo ID
    getSuatDienByIDSuKienCtrl: async (req, res) => {
        try {
            const data = await getSuatDienByID(req.params.idSuKien);
            if (data) res.status(200).json(data);
            else res.status(404).json({ message: 'Không tìm thấy suất diễn' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Tạo suất diễn mới
    createSuatDienCtrl: async (req, res) => {
        try {
            const suatDienData = getSuatDienData(req.body);
            const idSuatDien = uuidv4();
            await createSuatDien(idSuatDien, suatDienData);
            res.status(201).json({ message: 'Tạo suất diễn thành công', id: idSuatDien });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Cập nhật suất diễn
    updateSuatDienCtrl: async (req, res) => {
        try {
            const suatDienData = getSuatDienData(req.body);
            await updateSuatDien(req.params.idSuatDien, suatDienData);
            res.status(200).json({ message: 'Cập nhật suất diễn thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Xóa suất diễn
    deleteSuatDienCtrl: async (req, res) => {
        try {
            await deleteSuatDien(req.params.idSuatDien);
            res.status(200).json({ message: 'Xóa suất diễn thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

export default SuatDienController;
