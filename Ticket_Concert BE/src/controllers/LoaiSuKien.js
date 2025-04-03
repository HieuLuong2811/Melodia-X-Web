import { getAllLoaiSuKien, getLoaiSuKienByID, createLoaiSuKien, updateLoaiSuKien, deleteLoaiSuKien } from '../models/LoaiSuKien.js';
import { v4 as uuidv4 } from 'uuid';

// Chuẩn hóa dữ liệu đầu vào
const getLoaiSuKienData = (data) => {
    return {
        tenLoai: data.TenLoai
    };
};

// Lấy tất cả loại sự kiện
export const getLoaiSuKien = async (req, res) => {
    try {
        const data = await getAllLoaiSuKien();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy loại sự kiện theo ID
export const getLoaiSuKienByID = async (req, res) => {
    try {
        const data = await getLoaiSuKienByID(req.params.idLoaiSuKien);
        if (data) res.json(data);
        else res.status(404).json({ message: 'Không tìm thấy loại sự kiện' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo loại sự kiện mới
export const createLoaiSuKien = async (req, res) => {
    try {
        const loaiSuKienData = getLoaiSuKienData(req.body);
        const idLoaiSuKien = uuidv4();
        await createLoaiSuKien(idLoaiSuKien, loaiSuKienData);
        res.status(201).json({ message: 'Tạo loại sự kiện thành công', id: idLoaiSuKien });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật loại sự kiện
export const updateLoaiSuKien = async (req, res) => {
    try {
        const loaiSuKienData = getLoaiSuKienData(req.body);
        await updateLoaiSuKien(req.params.idLoaiSuKien, loaiSuKienData);
        res.json({ message: 'Cập nhật loại sự kiện thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa loại sự kiện
export const deleteLoaiSuKien = async (req, res) => {
    try {
        await deleteLoaiSuKien(req.params.idLoaiSuKien);
        res.json({ message: 'Xóa loại sự kiện thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
