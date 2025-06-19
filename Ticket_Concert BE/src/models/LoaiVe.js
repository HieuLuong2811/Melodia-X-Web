import pool from '../config/db.js';

// Lấy tất cả loại vé
export const getAllLoaiVe = async () => {
    try {
        const [rows] = await pool.query("SELECT * FROM LoaiVe");
        return rows;
    } catch (error) {
        throw error;
    }
};

// Lấy loại vé theo ID
export const getLoaiVeByID = async (idLoaiVe) => {
    try {
        const [rows] = await pool.query("SELECT * FROM LoaiVe WHERE IDLoaiVe = ?", [idLoaiVe]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

export const getLoaiVeByIDSuatDien = async (idSuatDien) => {
    try {
        const [rows] = await pool.query(
            "SELECT LV.IDLoaiVe, SD.IDSuatDien, LV.TenVe, LV.AnhVe, LV.GiaVe, LV.ThongTinVe, LV.SoLuongVe, LV.SoLuongToiDaMotDon, SD.ThoiGianBatDau, SD.ThoiGianKetThuc FROM LoaiVe LV INNER JOIN SuatDien SD ON LV.IDSuatDien = SD.IDSuatDien WHERE LV.IDSuatDien = ?", 
            [idSuatDien]
        );
        return rows; 
    } catch (error) {
        throw error;
    }
};

// Thêm mới loại vé
export const createLoaiVe = async (idLoaiVe, loaiVeData, connection) => {
    try {
        const query = `
            INSERT INTO LoaiVe (IDLoaiVe, IDSuatDien, TenVe, AnhVe, GiaVe, SoLuongVe, SoLuongToiDaMotDon, ThongTinVe)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const { IDSuatDien, TenVe, AnhVe, GiaVe, SoLuongVe, SoLuongToiDaMotDon, ThongTinVe } = loaiVeData;
        await connection.query(query, [idLoaiVe, IDSuatDien, TenVe, AnhVe, GiaVe, SoLuongVe, SoLuongToiDaMotDon, ThongTinVe]);              
        return idLoaiVe;
    } catch (error) {   
        throw error;
    }
};

// Cập nhật loại vé
export const updateLoaiVe = async (idLoaiVe, loaiVeData) => {
    try {
        const query = `
            UPDATE LoaiVe SET IDSuatDien = ?, TenVe = ?, AnhVe = ?, GiaVe = ?, SoLuongVe = ?, SoLuongToiDaMotDon = ?, ThongTinVe = ?
            WHERE IDLoaiVe = ?
        `;
        const { IDSuatDien, TenVe, AnhVe, GiaVe, SoLuongVe, SoLuongToiDaMotDon, ThongTinVe } = loaiVeData;

        const [result] = await pool.query(query, [IDSuatDien, TenVe, AnhVe, GiaVe, SoLuongVe, SoLuongToiDaMotDon, ThongTinVe, idLoaiVe]);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

// Xóa loại vé
export const deleteLoaiVe = async (idLoaiVe) => {
    try {
        const [result] = await pool.query("DELETE FROM LoaiVe WHERE IDLoaiVe = ?", [idLoaiVe]);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

export const getVeDaMuaByUserId = async (idNguoiDung) => {
    const [rows] = await pool.query(`
      SELECT 
          sk.IDSuKien,  
          sk.TenSuKien,
          lv.TenVe,
          lv.GiaVe,
          cthd.SoLuong,
          cthd.GiaTien,
          cthd.TrangThaiVe,
          hd.NgayThanhToan
      FROM ChiTietHoaDon cthd
      JOIN HoaDonMuaVe hd ON cthd.IDHoaDon = hd.IDHoaDon
      JOIN LoaiVe lv ON cthd.IDLoaiVe = lv.IDLoaiVe
      JOIN SuatDien sd ON lv.IDSuatDien = sd.IDSuatDien
      JOIN SuKien sk ON sd.IDSuKien = sk.IDSuKien
      WHERE hd.IDNguoiDung = ?
    `, [idNguoiDung]);
  
    return rows;
};

export const checkAndUpdateSoLuongVe = async (idLoaiVe, soLuong, connection = pool) => {
    const [result] = await connection.query(`
        UPDATE LoaiVe 
        SET SoLuongVe = SoLuongVe - ? 
        WHERE IDLoaiVe = ? AND SoLuongVe >= ?`, [soLuong, idLoaiVe, soLuong]
    );

    if (result.affectedRows === 0) {
        throw new Error(`Không đủ số lượng vé cho IDLoaiVe: ${idLoaiVe}`);
    }

    return result;
};

export const returnLoaiVe = async (idLoaiVe, soLuong, connection = pool) => {
    const [result] = await connection.query(`
        UPDATE LoaiVe 
        SET SoLuongVe = SoLuongVe + ? 
        WHERE IDLoaiVe = ?`, [soLuong, idLoaiVe]
    );

    if (result.affectedRows === 0) {
        throw new Error(`Không tìm thấy loại vé với ID: ${idLoaiVe}`);
    }

    return result;
};