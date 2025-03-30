// controllers/suKien.js
import { getAllSuKien, getSuKienById, createSuKien, updateSuKien, deleteSuKien } from '../models/SuKien.js';
import { v4 as uuidv4 } from 'uuid';

// Chuẩn hóa dữ liệu sự kiện
const getSuKienData = (data) => ({
    idLoaiSuKien: data.IDLoaiSuKien,
    idNguoiDung: data.IDNguoiDung,
    logo: data.Logo,
    anhNen: data.AnhNen,
    tenSuKien: data.TenSuKien,
    diaDiem: data.DiaDiem,
    thongTinSuKien: data.ThongTinSuKien,
    trangThaiSuKien: data.TrangThaiSuKien || "Chờ xác nhận",
    logoBanToChuc: data.LogoBanToChuc, 
    tenBanToChuc: data.TenBanToChuc, 
    thongTinBanToChuc: data.ThongTinBanToChuc,
});


// Lấy tất cả sự kiện
export const getSuKien = async (req, res) => {
    try {
        const suKiens = await getAllSuKien();
        res.json(suKiens);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách sự kiện", error: error.message });
    }
};

// Lấy sự kiện theo ID
export const getSuKienByID = async (req, res) => {
    try {
        const suKien = await getSuKienById(req.params.idSuKien);
        if (suKien) res.json(suKien);
        else res.status(404).json({ message: "Sự kiện không tồn tại" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy sự kiện", error: error.message });
    }
};

// Thêm mới sự kiện
export const createSuKienController = async (req, res) => {
    try {
        const suKienData = getSuKienData(req.body);
        suKienData.idSuKien = uuidv4().substring(0,10); 

        const id = await createSuKien(suKienData);
        res.status(201).json({ message: "Tạo sự kiện thành công", id });
    } catch (error) {
        res.status(500).json({ message: "Lỗi tạo sự kiện", error: error.message });
    }
};

// Cập nhật sự kiện
export const updateSuKienController = async (req, res) => {
    try {
        const suKienData = getSuKienData(req.body);
        await updateSuKien(req.params.idSuKien, suKienData);
        res.json({ message: "Cập nhật sự kiện thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật sự kiện", error: error.message });
    }
};

// Xóa sự kiện
export const deleteSuKienController = async (req, res) => {
    try {
        await deleteSuKien(req.params.idSuKien);
        res.json({ message: "Xóa sự kiện thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa sự kiện", error: error.message });
    }
};
