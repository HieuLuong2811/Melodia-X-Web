import { getAllLoaiVe, getLoaiVeByID, getLoaiVeByIDSuatDien, getVeDaMuaByUserId, createLoaiVe, updateLoaiVe, deleteLoaiVe } from '../models/LoaiVe.js';
import { v4 as uuidv4 } from 'uuid';

// Hàm lấy dữ liệu từ request body
const getLoaiVeData = (data) => ({
    IDSuatDien: data.IDSuatDien,
    TenVe: data.TenVe,
    AnhVe: data.AnhVe || null,
    GiaVe: data.GiaVe,
    SoLuongVe: data.SoLuongVe,
    ThongTinVe: data.ThongTinVe || null
});

// Lấy tất cả loại vé
export const getLoaiVe = async (req, res) => {
    try {
        const loaiVeList = await getAllLoaiVe();
        res.json(loaiVeList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy loại vé theo ID
export const getLoaiVeByIDHandler = async (req, res) => {
    try {
        const loaiVe = await getLoaiVeByID(req.params.idLoaiVe);
        if (loaiVe) res.json(loaiVe);
        else res.status(404).json({ message: 'Không tìm thấy loại vé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLoaiVeByIDSuatDien = async (req, res) => {
    try {
        const suatdien = await getLoaiVeByIDSuatDien(req.params.idSuatDien);
        res.json(suatdien)
    }catch(error){
        res.status(500).json({massage : error.massage});
    }
}

// Thêm loại vé mới
export const createLoaiVeHandler = async (req, res) => {
    try {
        const loaiVeData = getLoaiVeData(req.body);
        const idLoaiVe = uuidv4();

        await createLoaiVe(idLoaiVe, loaiVeData);
        res.status(201).json({ message: 'Tạo loại vé thành công', id: idLoaiVe });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật loại vé
export const updateLoaiVeHandler = async (req, res) => {
    try {
        const loaiVeData = getLoaiVeData(req.body);
        const affectedRows = await updateLoaiVe(req.params.idLoaiVe, loaiVeData);
        if (affectedRows) res.json({ message: 'Cập nhật loại vé thành công' });
        else res.status(404).json({ message: 'Không tìm thấy loại vé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa loại vé
export const deleteLoaiVeHandler = async (req, res) => {
    try {
        const affectedRows = await deleteLoaiVe(req.params.idLoaiVe);
        if (affectedRows) res.json({ message: 'Xóa loại vé thành công' });
        else res.status(404).json({ message: 'Không tìm thấy loại vé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getVeDaMuaByUserId = async (req, res) => {
    try {
      const { idNguoiDung } = req.params;
      const veDaMua = await getVeDaMuaByUserId(idNguoiDung);
      
      res.status(200).json(veDaMua);
    } catch (error) {
      console.error('Lỗi khi lấy vé đã mua:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server. Không thể lấy dữ liệu vé đã mua.'
      });
    }
  };