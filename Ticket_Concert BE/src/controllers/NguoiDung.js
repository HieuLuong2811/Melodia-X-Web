// controllers/NguoiDungController.js
import { getAllNguoiDung, getNguoiDungByID, createNguoiDung, updateNguoiDung, updateTrangThaiNguoiDung, deleteNguoiDung } from '../models/NguoiDung.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const getNguoiDungData = (data) => ({
    hinhAnh: data.HinhAnh || null,
    tenNguoiDung: data.TenNguoiDung,
    email: data.Email,
    soDienThoai: data.SoDienThoai || null,
    gioiTinh: data.GioiTinh || null,
    ngaySinh: data.NgaySinh || null,
    matKhau: data.MatKhau,
    quyenHan: data.QuyenHan || 'Admin',
    trangThai: data.TrangThai || 'Hoạt động'
});

const NguoiDungController = {
    getNguoiDungCtrl: async (req, res) => {
        try {
            const users = await getAllNguoiDung();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    lockOrUnlockUser: async (req, res) => {
        try {
            const idNguoiDung = req.params.idNguoiDung
            const {trangThai} = req.body;
        
            const affectedRows = await updateTrangThaiNguoiDung(idNguoiDung, trangThai);
        
            if (affectedRows === 0) {
            return res.status(404).json({ message: `Không tìm thấy sự kiện với ID: ${idNguoiDung}` });
            }
        
            let message = "Cập nhật trạng thái sự kiện thành công";
        
            res.json({ message });
        } catch (error) {
            console.error(`Lỗi khi cập nhật trạng thái sự kiện ${req.params.idNguoiDung}:`, error);
            res.status(500).json({ message: `Lỗi khi cập nhật trạng thái sự kiện: ${error.message}` });
        }
    },

    getNguoiDungByIdCtrl: async (req, res) => {
        try {
            const user = await getNguoiDungByID(req.params.idNguoiDung);
            if (user) res.json(user);
            else res.status(404).json({ message: 'Không tìm thấy người dùng' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createNguoiDungCtrl: async (req, res) => {
        try {
            const nguoiDungData = getNguoiDungData(req.body);
            const idNguoiDung = uuidv4();

            nguoiDungData.matKhau = await bcrypt.hash(nguoiDungData.matKhau, 10);

            const id = await createNguoiDung(idNguoiDung, nguoiDungData);
            res.status(201).json({ message: 'Tạo người dùng thành công', id });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateNguoiDungCtrl: async (req, res) => {
        try {
            const nguoiDungData = getNguoiDungData(req.body);

            // Nếu có mật khẩu mới, băm nó
            if (nguoiDungData.matKhau) {
                nguoiDungData.matKhau = await bcrypt.hash(nguoiDungData.matKhau, 10);
            }

            await updateNguoiDung(req.params.idNguoiDung, nguoiDungData);
            res.json({ message: 'Cập nhật người dùng thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteNguoiDungCtrl: async (req, res) => {
        try {
            await deleteNguoiDung(req.params.idNguoiDung);
            res.json({ message: 'Xóa người dùng thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

export default NguoiDungController;
