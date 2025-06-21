import { getAllThongTinThanhToan, getThongTinThanhToanByID, createThongTinThanhToan, updateThongTinThanhToan, deleteThongTinThanhToan } from '../models/ThongTinThanhToan.js';
import { v4 as uuidv4 } from 'uuid';

const getThongTinThanhToanData = (data) => ({
    idNguoiDung: data.IDNguoiDung,
    chuTaiKhoan: data.ChuTaiKhoan,
    soTaiKhoan: data.SoTaiKhoan,
    tenNganHang: data.TenNganHang,
    chiNhanh: data.ChiNhanh,
    loaiHinh: data.LoaiHinh
});

const ThongTinThanhToanController = {

    getThongTinThanhToanCtrl: async (req, res) => {
        try {
            const thongTinList = await getAllThongTinThanhToan();
            res.status(200).json(thongTinList);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getThongTinThanhToanByIDCtrl: async (req, res) => {
        try {
            const thongTin = await getThongTinThanhToanByID(req.params.idNguoiDung);
            if (thongTin) res.status(200).json(thongTin);
            else res.status(404).json({ message: 'Không tìm thấy thông tin thanh toán' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createThongTinThanhToanCtrl: async (req, res) => {
        try {
            const thongTinData = getThongTinThanhToanData(req.body);
            const idThongTin = uuidv4();

            const id = await createThongTinThanhToan(idThongTin, thongTinData);
            res.status(201).json({ message: 'Thêm thông tin thanh toán thành công', id });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateThongTinThanhToanCtrl: async (req, res) => {
        try {
            const thongTinData = getThongTinThanhToanData(req.body);
            await updateThongTinThanhToan(req.params.idThongTin, thongTinData);
            res.status(200).json({ message: 'Cập nhật thông tin thanh toán thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteThongTinThanhToanCtrl: async (req, res) => {
        try {
            await deleteThongTinThanhToan(req.params.idThongTin);
            res.status(200).json({ message: 'Xóa thông tin thanh toán thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}

export default ThongTinThanhToanController;

