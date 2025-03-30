import { getAllThanhVien, getThanhVienByID, createThanhVien, updateThanhVien, deleteThanhVien } from '../models/ThanhVien.js';
import { v4 as uuidv4 } from 'uuid';

const getThanhVienData = (data) => ({
    idSuKien: data.IDSuKien,
    tenThanhVien: data.TenThanhVien,
    email : data.Email,
    vaiTro: data.VaiTro
});

export const getThanhVien = async (req, res) => {
    try {
        const members = await getAllThanhVien();
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getThanhVienByID = async (req, res) => {
    try {
        const member = await getThanhVienByID(req.params.idThanhVien);
        if (member) res.json(member);
        else res.status(404).json({ message: 'Không tìm thấy thành viên' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createThanhVien = async (req, res) => {
    try {
        const thanhVienData = getThanhVienData(req.body);
        const idThanhVien = uuidv4();

        const id = await createThanhVien(idThanhVien, thanhVienData);
        res.status(201).json({ message: 'Thêm thành viên thành công', id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateThanhVien = async (req, res) => {
    try {
        const thanhVienData = getThanhVienData(req.body);
        await updateThanhVien(req.params.idThanhVien, thanhVienData);
        res.json({ message: 'Cập nhật thành viên thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteThanhVien = async (req, res) => {
    try {
        await deleteThanhVien(req.params.idThanhVien);
        res.json({ message: 'Xóa thành viên thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
