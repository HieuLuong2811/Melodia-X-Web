import pool from '../config/db.js';


const getHoaDonMuaVeData = (hoaDon) => {
    return [
        hoaDon.idNguoiDung,
        hoaDon.tongSoVe,
        hoaDon.ngayThanhToan || null,
        hoaDon.tongTien,
        hoaDon.phuongThucThanhToan
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
        `INSERT INTO HoaDonMuaVe (IDHoaDon, IDNguoiDung, TongSoVe, NgayThanhToan, TongTien, PhuongThucThanhToan)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [idHoaDon, ...HoaDonData]
    );

    return idHoaDon;
};

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
            GROUP BY h.IDHoaDon;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
};
