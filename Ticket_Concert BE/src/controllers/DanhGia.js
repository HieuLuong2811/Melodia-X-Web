import { getAllDanhGia, getDanhGiaByID, createDanhGia, updateDanhGia, deleteDanhGia } from '../models/DanhGia.js';
import { v4 as uuidv4 } from 'uuid';

const getDanhGiaData = (data) => ({
    idSuKien: data.IDSuKien,
    idNguoiDung: data.IDNguoiDung,
    danhGia: data.DanhGia,
    nhanXet: data.NhanXet || null
});

export const getDanhGia = async (req, res) => {
    try {
        const danhGiaList = await getAllDanhGia();
        res.json(danhGiaList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDanhGiaByID = async (req, res) => {
    try {
        const danhGia = await getDanhGiaByID(req.params.idDanhGia);
        if (danhGia) res.json(danhGia);
        else res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createDanhGia = async (req, res) => {
    try {
        const danhGiaData = getDanhGiaData(req.body);
        const idDanhGia = uuidv4();

        const id = await createDanhGia(idDanhGia, danhGiaData);
        res.status(201).json({ message: 'Thêm đánh giá thành công', id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateDanhGia = async (req, res) => {
    try {
        const danhGiaData = getDanhGiaData(req.body);
        await updateDanhGia(req.params.idDanhGia, danhGiaData);
        res.json({ message: 'Cập nhật đánh giá thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteDanhGia = async (req, res) => {
    try {
        await deleteDanhGia(req.params.idDanhGia);
        res.json({ message: 'Xóa đánh giá thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
