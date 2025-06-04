import pool from '../config/db.js';


const getHoaDonMuaVeData = (hoaDon) => {
    return [
        hoaDon.idNguoiDung,
        hoaDon.tongSoVe,
        hoaDon.ngayThanhToan || null,
        hoaDon.tongTien,
        hoaDon.phuongThucThanhToan,
        hoaDon.trangThaiThanhToan || 'Chưa thanh toán'
    ];
};

// Lấy tất cả hóa đơn
export const getAllHoaDon = async () => {
    const [rows] = await pool.query('SELECT * FROM HoaDonMuaVe');
    return rows;
};

// Lấy hóa đơn theo ID
export const getHoaDonByID = async (idHoaDon) => {
    const [rows] = await pool.query('SELECT * FROM HoaDonMuaVe WHERE IDHoaDon = ?', [idHoaDon]);
    return rows.length ? rows[0] : null;
};

// Tạo hóa đơn mới
export const createHoaDon = async (idHoaDon,hoaDon ) => {
    const HoaDonData = getHoaDonMuaVeData(hoaDon);

    const [result] = await pool.query(
        `INSERT INTO HoaDonMuaVe (IDHoaDon, IDNguoiDung, TongSoVe, NgayThanhToan, TongTien, PhuongThucThanhToan, TrangThaiThanhToan)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [idHoaDon, ...HoaDonData]
    );

    return idHoaDon;
};

export const deleteHoaDon = async (idHoaDon) => {
    const [result] = await pool.query('delete from HoaDonMuaVe where IDHoaDon = ?', [idHoaDon]);
    return result;
}   

export const fetchAllHoaDonChiTiet = async () => {
    try {
        const [rows] = await pool.query(`
            SELECT h.*, 
                COALESCE(
                    JSON_ARRAYAGG(
                        CASE 
                            WHEN c.IDChiTietHoaDon IS NOT NULL THEN 
                                JSON_OBJECT(
                                    'idChiTiet', c.IDChiTietHoaDon,
                                    'idLoaiVe', c.IDLoaiVe,
                                    'soLuong', c.SoLuong,
                                    'giaTien', c.GiaTien,
                                    'trangThaiVe', c.TrangThaiVe
                                )
                            ELSE NULL
                        END
                    ),
                    JSON_ARRAY()
                ) AS chiTietHoaDon
            FROM HoaDonMuaVe h
            LEFT JOIN ChiTietHoaDon c ON h.IDHoaDon = c.IDHoaDon
            INNER JOIN NguoiDung
            GROUP BY h.IDHoaDon;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
};


export const getHoaDonByIDSuatDien = async(idSuatDien) => {
    const [result] = await pool.query(`
       SELECT
            ND.TenNguoiDung,
            ND.Email,
            ND.SoDienThoai,
            HD.PhuongThucThanhToan,
            SUM(HD.TongSoVe) AS TongSoVeMua,
            SUM(HD.TongTien) AS TongTienThanhToan
        FROM HoaDonMuaVe HD
        JOIN NguoiDung ND ON HD.IDNguoiDung = ND.IDNguoiDung
        JOIN ChiTietHoaDon CTHD ON HD.IDHoaDon = CTHD.IDHoaDon
        JOIN LoaiVe LV ON CTHD.IDLoaiVe = LV.IDLoaiVe
        JOIN SuatDien SD ON LV.IDSuatDien = SD.IDSuatDien
        WHERE SD.IDSuatDien = ? 
        GROUP BY ND.TenNguoiDung, ND.Email, ND.SoDienThoai, HD.PhuongThucThanhToan;`, [idSuatDien]);
    return result;
}