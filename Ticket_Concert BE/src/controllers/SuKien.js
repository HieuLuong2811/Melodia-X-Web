// controllers/suKien.js
import { getSuKienListUser,getSuKienListAdmin, CountSuKien, DuyetSuKien, getSuKienDatalist , getSuKienById, getSuKienByIdUser ,createSuKien, updateSuKien, deleteSuKien, getSuKienChiTietById } from '../models/SuKien.js';
import { v4 as uuidv4 } from 'uuid';
import { createSuatDien } from '../models/SuatDien.js'; 
import { createLoaiVe } from '../models/LoaiVe.js';
import { createVeKhuVuc } from '../models/VeKhuVuc.js'
import ThongBaoModel from '../models/ThongBao.js'
import pool from '../config/db.js';
import { sendNotificationToUser } from '../models/notificationServiceSocket.js';
import { io } from '../app.js';

const getSuKienData = (data) => {
  return{
    idLoaiSuKien: data.IDLoaiSuKien,
    idNguoiDung: data.IDNguoiDung,
    tenSuKien: data.TenSuKien,
    logo: data.Logo,
    anhNen: data.AnhNen,
    diaDiem: data.DiaDiem,
    thongTinSuKien: data.ThongTinSuKien,
    logoBanToChuc: data.LogoBanToChuc,
    tenBanToChuc: data.TenBanToChuc,
    thongTinBanToChuc: data.ThongTinBanToChuc,
    video: data.Video,
  }
};

const SuKienController = {

  SoLuongEventCtrl: async(req, res) => {
    try {
      const count = await CountSuKien();  
      res.status(200).json(count);  
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy số lượng sự kiện", error: error.message });
    }
  },


  createSuKienCtrl: async (req, res) => {
    const {
      danhSachSuKien,
      danhSachSuatDien,
      danhSachLoaiVe,
      danhSachVeKhuVuc
    } = req.body;

    const connection = await pool.getConnection(); 
    await connection.beginTransaction(); 

    try {
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
        video: suKien.Video,
      };

      await createSuKien(IDSuKien, suKienData, connection);

      const suatDienResults = await Promise.all(
        danhSachSuatDien.map(async (suat) => {
          const IDSuatDien = uuidv4();
          const suatDienData = {
            idSuKien: IDSuKien,
            thoiGianBatDau: suat.ThoiGianBatDau,
            thoiGianKetThuc: suat.ThoiGianKetThuc,
          };
          await createSuatDien(IDSuatDien, suatDienData, connection);
          return {
            tempIDSuatDien: suat.IDSuatDien,
            IDSuatDien,
          };
        })
      );

      const loaiVeResults = await Promise.all(
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
          SoLuongToiDaMotDon: ve.SoLuongToiDaMotDon,
          ThongTinVe: ve.ThongTinVe || null,
        };
        await createLoaiVe(IDLoaiVe, loaiVeData, connection);
        return {
          tempIDLoaiVe: ve.IDLoaiVe,
          IDLoaiVe,
        };
      })
    );

      await Promise.all(
        danhSachVeKhuVuc.map(async (ve) => {
          const IDVeGhe = uuidv4();
          const suatDien = suatDienResults.find((sd) => sd.tempIDSuatDien === ve.IDSuatDien);
          const loaiVe = loaiVeResults.find((lv) => lv.tempIDLoaiVe === ve.IDLoaiVe);
          if (!suatDien || !loaiVe) throw new Error(`Dữ liệu không hợp lệ cho vé khu vực với tempIDSuatDien: ${ve.IDSuatDien} hoặc tempIDLoaiVe: ${ve.IDLoaiVe}`);

          const veKhuVucData = {
            IDSuatDien: suatDien.IDSuatDien,
            IDLoaiVe: loaiVe.IDLoaiVe,
            IDKhuVuc: ve.IDKhuVuc,
            IDSuKien: IDSuKien,
          };

          await createVeKhuVuc(IDVeGhe, veKhuVucData, connection);
        }),
      );

      await connection.commit(); 
      connection.release();

      res.status(201).json({
        message: 'Tạo sự kiện thành công',
        IDSuKien,
      });
    } catch (error) {
      await connection.rollback(); 
      connection.release();

      console.error('Lỗi khi tạo sự kiện:', error);
      res.status(500).json({
        message: 'Lỗi khi tạo sự kiện',
        error: error.message,
      });
    }
  },

  getSuKienTongVeBanCtrl: async (req, res) => {
    try {
        const suKiens = await getSuKienDatalist('TongVeBan');
        res.status(200).json(suKiens);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách sự kiện", error: error.message });
    }
  },

  getSuKienGanNhatMuaCtrl: async (req, res) => {
    try {
        const suKiens = await getSuKienDatalist('GanNhatMua');
        res.status(200).json(suKiens);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách sự kiện", error: error.message });
    }
  },

  getSuKienCoVideoCtrl: async (req, res) => {
    try {
      const suKiens = await getSuKienDatalist('SuKienCoVideo');
      res.status(200).json(suKiens);
    } catch (error) {
      console.error("Lỗi getSuKienCoVideo:", error); 
      res.status(500).json({ message: "Lỗi lấy danh sách sự kiện", error: error.message });
    }
  },

  getSuKienUserCtrl: async (req, res) => {
    try {
        const suKiens = await getSuKienListUser();
        res.status(200).json(suKiens);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách sự kiện", error: error.message });
    }
  },

  getSuKienAdminCtrl: async (req, res) => {
    try {
        const suKiens = await getSuKienListAdmin();
        res.status(200).json(suKiens);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách sự kiện", error: error.message });
    }
  },

  getSuKienByIdFromDBCtrl: async (req, res) => {
      try {
          const event = await getSuKienById(req.params.idSuKien)

          if (event.length === 0) {
              return res.status(404).json({ message: "Không tìm thấy sự kiện!" });
          }


          const suKienMap = {};

          event.forEach(row => {
              const { IDSuKien,IDLoaiSuKien, TenSuKien, Logo, AnhNen, DiaDiem, ThongTinSuKien, LogoBanToChuc, TenBanToChuc, ThongTinBanToChuc, Video, IDSuatDien, ThoiGianBatDau, ThoiGianKetThuc, IDLoaiVe, TenVe, GiaVe, SoLuongVe } = row;

              if (!suKienMap[IDSuKien]) {
                  suKienMap[IDSuKien] = {
                      IDSuKien,
                      IDLoaiSuKien,
                      TenSuKien,
                      Logo,
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

          return res.status(200).json(suKienArray[0]); 
      } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Lỗi server" });
      }
  },

  // Cập nhật sự kiện
  updateSuKienCtrl: async (req, res) => {
      try {
          const suKienData = getSuKienData(req.body);

          await updateSuKien(req.params.idSuKien, suKienData);
          res.status(200).json({ message: "Cập nhật sự kiện thành công" });
      } catch (error) {
          res.status(500).json({ message: "Lỗi cập nhật sự kiện", error: error.message });
      }
  },

  TrangThaiSuKienCtrl: async (req, res) => {
    try {
      const idSuKien = req.params.idSuKien;
      const idNguoiDung = req.query.idNguoiDung;
      const { trangThaiSuKien } = req.body;

      const affectedRows = await DuyetSuKien(idSuKien, trangThaiSuKien);

      if (affectedRows === 0) {
        return res.status(404).json({ message: `Không tìm thấy sự kiện với ID: ${idSuKien}` });
      }

      let message = "";

      if (trangThaiSuKien === "Đã xác nhận") message = `Sự kiện đã được duyệt.`;
      if (trangThaiSuKien === "Huỷ") message = `Sự kiện không được duyệt.`;

      const msg = {
        tieuDe: `Thông báo về sự kiện`,
        noiDung: message,
        ngayTao: new Date(),
        trangThai: 'Chưa đọc'
      };

      const idThongBao = uuidv4();

      if (!idNguoiDung) {
        console.warn("Thiếu IDNguoiDung trong request, không thể gửi thông báo.");
      } else {
        await ThongBaoModel.createThongBao(idThongBao, {
          idNguoiDung: idNguoiDung,
          ...msg,
        });
      }

      sendNotificationToUser(idNguoiDung, msg);

      io.emit("event_updated", {
        idSuKien,
        trangThaiSuKien,
        message: `Sự kiện ${idSuKien} ${trangThaiSuKien.toLowerCase()}`,
      })

      res.status(200).json({ message });
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái sự kiện ${req.params.idSuKien}:`, error);
      res.status(500).json({ message: `Lỗi khi cập nhật trạng thái sự kiện: ${error.message}` });
    }
  },

  // Xóa sự kiện
  deleteSuKienCtrl: async (req, res) => {
      try {
          await deleteSuKien(req.params.idSuKien);
          res.status(200).json({ message: "Xóa sự kiện thành công" });
      } catch (error) {
          res.status(500).json({ message: "Lỗi xóa sự kiện", error: error.message });
      }
  },

  getSuKienChiTietCtrl: async (req, res) => {
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
  },

  getSuKienByIdUserCtrl: async (req, res) => {
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
  },
};

export default SuKienController;


