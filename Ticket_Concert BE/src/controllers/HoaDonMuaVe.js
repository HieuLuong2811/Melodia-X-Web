import { getAllHoaDon, getHoaDonByID, createHoaDon, fetchAllHoaDonChiTiet, deleteHoaDon,getHoaDonByIDSuatDien  } from '../models/HoaDonMuaVe.js';
import {createChiTietHoaDon} from '../models/ChiTietHoaDon.js';
import { v4 as uuidv4 } from 'uuid';

const getHoaDonMuaVeData = (hoaDon) => ({
    idNguoiDung: hoaDon.idNguoiDung,
    tongSoVe: hoaDon.tongSoVe,
    ngayThanhToan: hoaDon.ngayThanhToan || new Date(), 
    tongTien: hoaDon.tongTien,
    phuongThucThanhToan: hoaDon.phuongThucThanhToan
});


const getChiTietHoaDonData = (chiTietList, idHoaDon) => {
    return chiTietList.map((data) => ({
        idHoaDon: idHoaDon,
        idLoaiVe: data.idLoaiVe,
        soLuong: data.soLuong,
        giaTien: data.giaTien,
        trangThaiVe: data.trangThaiVe
    }));
};

// Lấy danh sách tất cả hóa đơn
export const getAllHoaDon = async (req, res) => {
    try {
        const hoaDonList = await getAllHoaDon();
        res.json(hoaDonList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy hóa đơn theo ID
export const getHoaDonByID = async (req, res) => {
    try {
        const hoaDon = await getHoaDonByID(req.params.idHoaDon);
        if (hoaDon) res.json(hoaDon);
        else res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getHoaDonByIDsuatdien = async (req, res) => {
    try {
        const hoaDon = await getHoaDonByIDSuatDien(req.params.idSuatDien);
        if (hoaDon) res.json(hoaDon);
        else res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteHoaDoncontrollers = async (req, res) => {
    try {
        const result = await deleteHoaDon(req.params.idHoaDon);  
        if (result.affectedRows > 0) {
            res.json({ message: "Xoá hoá đơn thành công" });
        } else {
            res.status(400).json({ message: "Không tìm thấy hoá đơn" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// tạo hóa đơn và chi tiết hóa đơn
export const createHoaDonWithDetails = async (req, res) => {
    try {
        const HoaDonData = getHoaDonMuaVeData(req.body);
        
        const { chiTiet } = req.body;

        // Tạo ID hóa đơn
        const idHoaDon = uuidv4();
        
        // Tạo hóa đơn mới
        await createHoaDon(idHoaDon, HoaDonData);

        // Tạo danh sách chi tiết hóa đơn
        const chiTietHoaDonList = getChiTietHoaDonData(chiTiet, idHoaDon);


        // Thêm chi tiết hóa đơn vào DB
        for (const chiTietItem of chiTietHoaDonList) {
            const idChiTietHoaDon = uuidv4();
            await createChiTietHoaDon(idChiTietHoaDon, chiTietItem);
        }

        res.status(201).json({ message: "Tạo hóa đơn và chi tiết hóa đơn thành công", idHoaDon, tongTien : HoaDonData.tongTien });
    } catch (error) {
        console.error("Lỗi tạo hóa đơn:", error);
        res.status(500).json({ message: error.message });
    }
};

export const fetchAllHoaDonChiTiet  = async (req, res) => {
    try {
        const result = await fetchAllHoaDonChiTiet();
        res.json(result);
    } catch (error) {
        console.error("Lỗi khi lấy hóa đơn chi tiết:", error);
        res.status(500).json({ message: error.message });
    }
};

