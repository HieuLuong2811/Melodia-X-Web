import pool from '../config/db.js';

export const getDoanhThuBySuKien = async (idSuatDien) => {
    const sql = `
        SELECT 
            SUM(hd.TongTien) AS TongDoanhThu
        FROM HoaDonMuaVe hd
        JOIN ChiTietHoaDon cthd on hd.IDHoaDon = cthd.IDHoaDon
        JOIN LoaiVe lv ON cthd.IDLoaiVe = lv.IDLoaiVe
        JOIN SuatDien sd ON lv.IDSuatDien = sd.IDSuatDien
        JOIN SuKien sk ON sd.IDSuKien = sk.IDSuKien
        WHERE sd.IDSuatDien = ?
        GROUP BY sk.IDSuKien, sk.TenSuKien;
    `;
    const [rows] = await pool.query(sql, [idSuatDien]);
    return rows[0] || null;
};

export const getSoLuongVeDaBanBySuKien = async (idSuatDien) => {
    const sql = `
      SELECT 
            SUM(cthd.SoLuong) AS TongVeDaBan
        FROM ChiTietHoaDon cthd
        JOIN LoaiVe lv ON cthd.IDLoaiVe = lv.IDLoaiVe
        JOIN SuatDien sd ON lv.IDSuatDien = sd.IDSuatDien
        JOIN SuKien sk ON sd.IDSuKien = sk.IDSuKien
        WHERE sd.IDSuatDien = ?
        GROUP BY sk.IDSuKien, sk.TenSuKien;
    `;
    const [rows] = await pool.query(sql, [idSuatDien]);
    return rows[0] || null;
};

export const getSoLuongVeTonKho = async (idSuatDien) => {
    const sql = `
        SELECT 
            SUM(lv.SoLuongVe) AS TongVeTonKho
        FROM LoaiVe lv
        JOIN SuatDien sd ON lv.IDSuatDien = sd.IDSuatDien
        WHERE sd.IDSuatDien = ?
        GROUP BY sd.IDSuatDien;
    `;
    const [rows] = await pool.query(sql, [idSuatDien]);
    return rows[0] || null;
};

export const getDashboardBySuKien = async (idSuKien) => {
  const sql = `
    SELECT 
      sd.IDSuatDien,
      sd.ThoiGianBatDau,
      sd.ThoiGianKetThuc,

      COALESCE(SUM(cthd.SoLuong * cthd.GiaTien), 0) AS TongDoanhThu,
      COALESCE(SUM(cthd.SoLuong), 0) AS TongVeDaBan,
      COALESCE(SUM(DISTINCT lv.SoLuongVe), 0) AS TongVeTonKho

    FROM SuatDien sd
    LEFT JOIN LoaiVe lv ON sd.IDSuatDien = lv.IDSuatDien
    LEFT JOIN ChiTietHoaDon cthd ON lv.IDLoaiVe = cthd.IDLoaiVe
    LEFT JOIN HoaDonMuaVe hd ON hd.IDHoaDon = cthd.IDHoaDon AND hd.TrangThaiThanhToan = 'Đã thanh toán'

    WHERE sd.IDSuKien = ?

    GROUP BY sd.IDSuatDien, sd.ThoiGianBatDau, sd.ThoiGianKetThuc
    ORDER BY sd.ThoiGianBatDau ASC
  `;

  const [rows] = await pool.query(sql, [idSuKien]);
  return rows;
};

