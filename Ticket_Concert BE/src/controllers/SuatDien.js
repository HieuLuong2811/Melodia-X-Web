import { getAllSuatDien, getSuatDienByID, createSuatDien, updateSuatDien, deleteSuatDien } from '../models/SuatDien.js';
import { v4 as uuidv4 } from 'uuid';

// Xử lý dữ liệu từ request body
const getSuatDienData = (data) => {
    return {
        idSuKien: data.IDSuKien,
        thoiGianBatDau: data.ThoiGianBatDau,
        thoiGianKetThuc: data.ThoiGianKetThuc
    };
};

// Lấy tất cả suất diễn
export const getAllSuatDien = async (req, res) => {
    try {
        const data = await getAllSuatDien();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy suất diễn theo ID
export const getSuatDienByIDSuKien = async (req, res) => {
    try {
        const data = await getSuatDienByID(req.params.idSuKien);
        if (data) res.json(data);
        else res.status(404).json({ message: 'Không tìm thấy suất diễn' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo suất diễn mới
export const createSuatDien = async (req, res) => {
    try {
        const suatDienData = getSuatDienData(req.body);
        const idSuatDien = uuidv4();
        await createSuatDien(idSuatDien, suatDienData);
        res.status(201).json({ message: 'Tạo suất diễn thành công', id: idSuatDien });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật suất diễn
export const updateSuatDien = async (req, res) => {
    try {
        const suatDienData = getSuatDienData(req.body);
        await updateSuatDien(req.params.idSuatDien, suatDienData);
        res.json({ message: 'Cập nhật suất diễn thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa suất diễn
export const deleteSuatDien = async (req, res) => {
    try {
        await deleteSuatDien(req.params.idSuatDien);
        res.json({ message: 'Xóa suất diễn thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
