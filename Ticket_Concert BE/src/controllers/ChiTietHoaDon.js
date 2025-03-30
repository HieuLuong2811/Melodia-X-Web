import { getAllChiTietHoaDon, getChiTietHoaDonByID, createChiTietHoaDon } from '../models/ChiTietHoaDon.js';
import { v4 as uuidv4 } from 'uuid';

const getChiTietHoaDonData = (data) => ({
    idHoaDon: data.IDHoaDon,
    idLoaiVe: data.IDLoaiVe,
    soLuong: data.SoLuong,
    giaTien: data.GiaTien,
    trangThaiVe : data.TrangThaiVe,
});

export const getChiTietHoaDon = async (req, res) => {
    try {
        const details = await getAllChiTietHoaDon();
        res.json(details);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getChiTietHoaDonByID = async (req, res) => {
    try {
        const detail = await getChiTietHoaDonByID(req.params.idChiTietHoaDon);
        if (detail) res.json(detail);
        else res.status(404).json({ message: 'Không tìm thấy chi tiết hóa đơn' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createChiTietHoaDon = async (req, res) => {
    try {
        const chiTietHoaDonData = getChiTietHoaDonData(req.body);
        const idChiTietHoaDon = uuidv4();

        const id = await createChiTietHoaDon(idChiTietHoaDon, chiTietHoaDonData);
        res.status(201).json({ message: 'Thêm chi tiết hóa đơn thành công', id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
