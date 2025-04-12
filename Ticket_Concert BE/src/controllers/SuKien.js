// controllers/suKien.js
import { getAllSuKien, getAllSuKienAdmin, DuyetSuKien, getSuKienById, getSuKienByIdUser ,createSuKien, updateSuKien, deleteSuKien, getSuKienChiTietById } from '../models/SuKien.js';
import { v4 as uuidv4 } from 'uuid';
import { createSuatDien } from '../models/SuatDien.js'; 
import { createLoaiVe } from '../models/LoaiVe.js';
import { createThongTinThanhToan } from '../models/ThongTinThanhToan.js';

const getSuKienData = (data) => [
  data.idLoaiSuKien,
  data.idNguoiDung,
  data.logo,
  data.anhNen,
  data.tenSuKien,
  data.diaDiem,
  data.thongTinSuKien,
  data.trangThaiSuKien || "Chờ xác nhận",
  data.logoBanToChuc,
  data.tenBanToChuc,
  data.thongTinBanToChuc,
];

export const createSuKienlist = async (req, res) => {
  console.log(req.body);  
  const {
    danhSachSuKien,
    danhSachSuatDien,
    danhSachLoaiVe,
  } = req.body;

  try {
    // Tạo sự kiện 
    const suKien = danhSachSuKien[0];
    const IDSuKien = uuidv4();
    const suKienData = {
      idLoaiSuKien: suKien.IDLoaiSuKien,
      idNguoiDung: suKien.IDNguoiDung,
      logo: suKien.Logo,
      anhNen: suKien.AnhNen,
      tenSuKien: suKien.TenSuKien,
      diaDiem: suKien.DiaDiem,
      thongTinSuKien: suKien.ThongTinSuKien,
      trangThaiSuKien: 'Chờ xác nhận',
      logoBanToChuc: suKien.LogoBanToChuc,
      tenBanToChuc: suKien.TenBanToChuc,
      thongTinBanToChuc: suKien.ThongTinBanToChuc,
      video : suKien.video,
    };
    await createSuKien(IDSuKien, suKienData); 

    // 2. Tạo các suất diễn
    const suatDienResults = await Promise.all(
      danhSachSuatDien.map(async (suat) => {
        const IDSuatDien = uuidv4();
        const suatDienData = {
          idSuKien: IDSuKien,
          thoiGianBatDau: suat.ThoiGianBatDau,
          thoiGianKetThuc: suat.ThoiGianKetThuc,
        };
        await createSuatDien(IDSuatDien, suatDienData);
        return {
          tempIDSuatDien: suat.IDSuatDien,
          IDSuatDien, 
          ThoiGianBatDau: suat.ThoiGianBatDau,
          ThoiGianKetThuc: suat.ThoiGianKetThuc,
        };
      })
    );

    await Promise.all(
      danhSachLoaiVe.map(async (ve) => {
        const IDLoaiVe = uuidv4();
        const suatDien = suatDienResults.find((sd) => sd.tempIDSuatDien === ve.IDSuatDien);
        if (!suatDien) throw new Error(`Không tìm thấy suất diễn cho vé ${ve.TenVe}`);

        const loaiVeData = {
          IDSuatDien: suatDien.IDSuatDien,
          TenVe: ve.TenVe,
          AnhVe: ve.AnhVe || null,
          GiaVe: ve.GiaVe,
          SoLuongVe: ve.SoLuongVe,
          ThongTinVe: ve.ThongTinVe || null,
          TrangThai: ve.TrangThai || 'Còn vé'
        };
        await createLoaiVe(IDLoaiVe, loaiVeData);
      })
    );

    res.status(201).json({
      message: 'Tạo sự kiện thành công',
      IDSuKien,
    });
  } catch (error) {
    console.error('Lỗi khi tạo sự kiện:', error);
    res.status(500).json({
      message: 'Lỗi khi tạo sự kiện',
      error: error.message,
    });
  }
};

export default createSuKien ;

export const getSuKien = async (req, res) => {
    try {
        const suKiens = await getAllSuKien();
        res.json(suKiens);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách sự kiện", error: error.message });
    }
};

export const getSuKienAdmin = async (req, res) => {
  try {
      const suKiens = await getAllSuKienAdmin();
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
            const { IDSuKien, TenSuKien, AnhNen, DiaDiem, ThongTinSuKien, LogoBanToChuc, TenBanToChuc, ThongTinBanToChuc, Video, IDSuatDien, ThoiGianBatDau, ThoiGianKetThuc, IDLoaiVe, TenVe, GiaVe, SoLuongVe } = row;

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
                    Video,
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
                GiaVe,
                SoLuongVe
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

export const DuyetSuKienControllers = async (req, res) => {
  try {
    const idSuKien = req.params.idSuKien;
    if (!idSuKien) {
      return res.status(400).json({ message: "Thiếu ID sự kiện" });
    }

    const affectedRows = await DuyetSuKien(idSuKien);
    if (affectedRows === 0) {
      return res.status(404).json({ message: `Không tìm thấy sự kiện với ID: ${idSuKien}` });
    }

    res.json({ message: "Duyệt sự kiện thành công" });
  } catch (error) {
    console.error(`Lỗi khi duyệt sự kiện ${req.params.idSuKien}:`, error);
    res.status(500).json({ message: `Lỗi khi duyệt sự kiện: ${error.message}` });
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


export const getSuKienChiTiet = async (req, res) => {
    const { idSuKien } = req.params;
    try {
        const suKien = await getSuKienChiTietById(idSuKien);

        if (!suKien) {
            return res.status(404).json({ message: "Không tìm thấy sự kiện!" });
        }

        res.status(200).json(suKien);
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết sự kiện:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const getSuKienByIdUser = async (req, res) => {
  const { idNguoiDung } = req.params;
  try {
      const suKien = await getSuKienByIdUser(idNguoiDung);

      if (!suKien) {
          return res.status(404).json({ message: "Không tìm thấy sự kiện!" });
      }

      res.status(200).json(suKien);
  } catch (error) {
      console.error("Lỗi khi lấy chi tiết sự kiện:", error);
      res.status(500).json({ message: "Lỗi server" });
  }
};
