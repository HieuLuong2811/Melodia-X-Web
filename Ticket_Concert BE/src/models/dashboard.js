import pool from '../config/db.js';

export const getDoanhThuBySuKien = async (idSuKien) => {
    const sql = `
        SELECT 
            SUM(hd.TongTien) AS TongDoanhThu
        FROM HoaDonMuaVe hd
        JOIN ChiTietHoaDon cthd on hd.IDHoaDon = cthd.IDHoaDon
        JOIN LoaiVe lv ON cthd.IDLoaiVe = lv.IDLoaiVe
        JOIN SuatDien sd ON lv.IDSuatDien = sd.IDSuatDien
        JOIN SuKien sk ON sd.IDSuKien = sk.IDSuKien
        WHERE sk.IDSuKien = ?
        GROUP BY sk.IDSuKien, sk.TenSuKien;
    `;
    const [rows] = await pool.query(sql, [idSuKien]);
    return rows[0] || null;
};

export const getSoLuongVeDaBanBySuKien = async (idSuKien) => {
    const sql = `
      SELECT 
            SUM(cthd.SoLuong) AS TongVeDaBan
        FROM ChiTietHoaDon cthd
        JOIN LoaiVe lv ON cthd.IDLoaiVe = lv.IDLoaiVe
        JOIN SuatDien sd ON lv.IDSuatDien = sd.IDSuatDien
        JOIN SuKien sk ON sd.IDSuKien = sk.IDSuKien
        WHERE sk.IDSuKien = ?
        GROUP BY sk.IDSuKien, sk.TenSuKien;
    `;
    const [rows] = await pool.query(sql, [idSuKien]);
    return rows[0] || null;
};
