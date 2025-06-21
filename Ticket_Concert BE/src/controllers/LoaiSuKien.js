import { getAllLoaiSuKien, getLoaiSuKienByID, createLoaiSuKien, updateLoaiSuKien, deleteLoaiSuKien } from '../models/LoaiSuKien.js';
import { v4 as uuidv4 } from 'uuid';

const getLoaiSuKienData = (data) => {
    return {
        tenLoai: data.TenLoai
    };
};

const LoaiSuKienController = {

    // Lấy tất cả loại sự kiện
    getLoaiSuKienCtrl: async (req, res) => {
        try {
            const data = await getAllLoaiSuKien();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy loại sự kiện theo ID
    getLoaiSuKienByIDCtrl: async (req, res) => {
        try {
            const data = await getLoaiSuKienByID(req.params.idLoaiSuKien);
            if (data) res.status(200).json(data);
            else res.status(404).json({ message: 'Không tìm thấy loại sự kiện' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Tạo loại sự kiện mới
    createLoaiSuKienCtrl: async (req, res) => {
        try {
            const loaiSuKienData = getLoaiSuKienData(req.body);
            const idLoaiSuKien = uuidv4();
            await createLoaiSuKien(idLoaiSuKien, loaiSuKienData);
            res.status(201).json({ message: 'Tạo loại sự kiện thành công', id: idLoaiSuKien });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Cập nhật loại sự kiện
    updateLoaiSuKienCtrl: async (req, res) => {
        try {
            const loaiSuKienData = getLoaiSuKienData(req.body);
            await updateLoaiSuKien(req.params.idLoaiSuKien, loaiSuKienData);
            res.status(200).json({ message: 'Cập nhật loại sự kiện thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Xóa loại sự kiện
    deleteLoaiSuKienCtrl: async (req, res) => {
        try {
            await deleteLoaiSuKien(req.params.idLoaiSuKien);
            res.status(200).json({ message: 'Xóa loại sự kiện thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}

export default LoaiSuKienController;
