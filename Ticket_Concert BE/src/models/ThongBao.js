import pool from '../config/db.js';

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
    }
};

export default ThongBaoModel;
