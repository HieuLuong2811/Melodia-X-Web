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

export const getSuKienById = async (req, res) => {
    try {
        const event = await getSuKienById(req.params.idSuKien)

        if (event.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sự kiện!" });
        }


        const suKienMap = {};

        event.forEach(row => {
            const { IDSuKien, TenSuKien, AnhNen, DiaDiem, ThongTinSuKien, LogoBanToChuc, TenBanToChuc, ThongTinBanToChuc, IDSuatDien, ThoiGianBatDau, ThoiGianKetThuc, IDLoaiVe, TenVe, GiaVe } = row;

            if (!suKienMap[IDSuKien]) {
                suKienMap[IDSuKien] = {
                    IDSuKien,
                    TenSuKien,
                    AnhNen,
                    DiaDiem,
                    ThongTinSuKien,
                    LogoBanToChuc,
                    TenBanToChuc,
                    ThongTinBanToChuc,
                    suatDiens: {}
                };
            }


            if (!suKienMap[IDSuKien].suatDiens[IDSuatDien]) {
                suKienMap[IDSuKien].suatDiens[IDSuatDien] = {
                    IDSuatDien,
                    ThoiGianBatDau,
                    ThoiGianKetThuc,
                    loaiVes: []
                };
            }


            suKienMap[IDSuKien].suatDiens[IDSuatDien].loaiVes.push({
                IDLoaiVe,
                TenVe,
                GiaVe
            });
        });


        const suKienArray = Object.values(suKienMap).map(suKien => ({
            ...suKien,
            suatDiens: Object.values(suKien.suatDiens)
        }));

        return res.json(suKienArray[0]); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};

// Thêm mới sự kiện
export const createSuKien = async (req, res) => {
    try {
        const suKienData = getSuKienData(req.body);
        const idSuKien = uuidv4(); 

        const id = await createSuKien(idSuKien, suKienData);
        res.status(201).json({ message: "Tạo sự kiện thành công", id });
    } catch (error) {
        res.status(500).json({ message: "Lỗi tạo sự kiện", error: error.message });
    }
};

// Cập nhật sự kiện
export const updateSuKien = async (req, res) => {
    try {
        const suKienData = getSuKienData(req.body);
        await updateSuKien(req.params.idSuKien, suKienData);
        res.json({ message: "Cập nhật sự kiện thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật sự kiện", error: error.message });
    }
};

// Xóa sự kiện
export const deleteSuKien = async (req, res) => {
    try {
        await deleteSuKien(req.params.idSuKien);
        res.json({ message: "Xóa sự kiện thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa sự kiện", error: error.message });
    }
};
