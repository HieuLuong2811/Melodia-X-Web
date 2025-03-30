// controllers/NguoiDungController.js
import { getAllNguoiDung, getNguoiDungByID, createNguoiDung, updateNguoiDung, deleteNguoiDung } from '../models/NguoiDung.js';
import { v4 as uuidv4 } from 'uuid';

const getNguoiDungData = (data) => ({
    hinhAnh: data.HinhAnh || null,
    tenNguoiDung: data.TenNguoiDung,
    email: data.Email,
    soDienThoai: data.SoDienThoai,
    gioiTinh: data.GioiTinh || null,
    ngaySinh: data.NgaySinh || null,
    matKhau: data.MatKhau,
    quyenHan: data.QuyenHan || null
});

export const getNguoiDung = async (req, res) => {
    try {
        const users = await getAllNguoiDung();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getNguoiDungByID = async (req, res) => {
    try {
        const user = await getNguoiDungByID(req.params.idNguoiDung);
        if (user) res.json(user);
        else res.status(404).json({ message: 'Không tìm thấy người dùng' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createNguoiDung = async (req, res) => {
    try {
        const nguoiDungData = getNguoiDungData(req.body);
        const idNguoiDung = uuidv4();

        const id = await createNguoiDung(idNguoiDung, nguoiDungData);
        res.status(201).json({ message: 'Tạo người dùng thành công', id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateNguoiDung = async (req, res) => {
    try {
        const nguoiDungData = getNguoiDungData(req.body);
        await updateNguoiDung(req.params.idNguoiDung, nguoiDungData);
        res.json({ message: 'Cập nhật người dùng thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteNguoiDung = async (req, res) => {
    try {
        await deleteNguoiDung(req.params.idNguoiDung);
        res.json({ message: 'Xóa người dùng thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
