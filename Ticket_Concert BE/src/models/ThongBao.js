import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const ThongBaoModel = {
    // Lấy thông báo theo ID
    getThongBaoByID: async (idNguoiDung) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM ThongBao WHERE IDNguoiDung = ?', [idNguoiDung]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Tạo thông báo mới
    createThongBao: async (idThongBao, data) => {
        try {
            const { idNguoiDung, tieuDe, noiDung, ngayTao, trangThai } = data;
            await pool.execute(
                'INSERT INTO ThongBao (IDThongBao, IDNguoiDung, TieuDe, NoiDung, NgayTao, TrangThai) VALUES (?, ?, ?, ?, ?, ?)',
                [idThongBao, idNguoiDung, tieuDe, noiDung, ngayTao, trangThai]
            );
            return idThongBao;
        } catch (error) {
            throw error;
        }
    },

    //Update trạng thái thông báo
    updateTrangThaiThongBao: async (idThongBao, trangThai) => {
        try {
            const ok = await pool.execute('UPDATE ThongBao SET TrangThai = ? WHERE IDThongBao = ?', [trangThai, idThongBao]);
            return ok;
        } catch (error) {
            throw error;
        }
    },

    // Xóa thông báo
    deleteThongBao: async (idThongBao, idNguoiDung) => {
        try {
            await pool.execute('DELETE FROM ThongBao WHERE IDThongBao = ? and IDNguoiDung = ? ', [idThongBao, idNguoiDung]);
        } catch (error) {
            throw error;
        }
    },

    // Số lượng thông báo chưa đọc
    getSoLuongThongBaoChuaDoc: async (idNguoiDung) => {
        try {
            const [rows] = await pool.execute('SELECT COUNT(*) as SoLuong FROM ThongBao WHERE IDNguoiDung = ? AND TrangThai = ?', [idNguoiDung, 'Chưa đọc']);
            return rows[0].SoLuong;
        } catch (error) {
            throw error;
        }
    },

    sendToUsersBySuatDien: async (idSuKien, idSuatDien, tieuDe, noiDung) => {
        try {
            const [rows] = await pool.execute(`
                SELECT DISTINCT hd.IDNguoiDung
                FROM HoaDonMuaVe hd
                JOIN ChiTietHoaDon cthd ON hd.IDHoaDon = cthd.IDHoaDon
                JOIN LoaiVe lv ON cthd.IDLoaiVe = lv.IDLoaiVe
                WHERE lv.IDSuatDien = ? 
            `, [idSuatDien]);

            for (const row of rows) {
                const idThongBao = uuidv4();
                const data = {
                    idNguoiDung: row.IDNguoiDung,
                    tieuDe,
                    noiDung,
                    ngayTao: new Date(),
                    trangThai: 'Chưa đọc'
                };
                await ThongBaoModel.createThongBao(idThongBao, data);
            }

            console.log(`✅ Gửi thông báo cho ${rows.length} user ở sự kiện ${idSuKien}, suất diễn ${idSuatDien}`);
        } catch (error) {
            console.error("❌ Lỗi gửi thông báo:", error);
        }
    },
};

export default ThongBaoModel;
