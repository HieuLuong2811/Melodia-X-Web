import pool from '../config/db.js';

// Lấy tất cả sự kiện
export const getSuKienListAdmin = async (isAdmin = false) => {
    const sql = `SELECT 
    IDSuKien,
    IDNguoiDung,
    TenSuKien,
    AnhNen,
    DiaDiem,
    LogoBanToChuc,
    TenBanToChuc,
    TrangThaiSuKien FROM SuKien`
    const [rows] = await pool.query(sql);
    return rows;
};

export const getSuKienListUser = async (isAdmin = false) => {
    const sql = `SELECT 
            sk.IDSuKien,
            sk.TenSuKien,
            sk.AnhNen,
            MIN(sd.ThoiGianBatDau) AS NgayDienDauTien,
            MIN(lv.GiaVe) AS GiaVeReNhat
            FROM SuKien sk
            JOIN SuatDien sd ON sk.IDSuKien = sd.IDSuKien
            JOIN LoaiVe lv ON lv.IDSuatDien = sd.IDSuatDien
        WHERE sk.TrangThaiSuKien in ('Đã xác nhận', 'Chưa bắt đầu', 'Đang diễn ra', 'Hoàn thành')
        GROUP BY sk.IDSuKien, sk.TenSuKien, sk.AnhNen
        ORDER BY NgayDienDauTien ASC;`
    const [rows] = await pool.query(sql);
    return rows;
};

export const getSuKienDatalist = async (type) => {
    let sql;
    switch (type) {
        case 'TongVeBan':
            sql = `
                SELECT sk.Logo, SUM(cthd.SoLuong) AS TongVeBan
                FROM SuKien sk
                JOIN SuatDien sd ON sk.IDSuKien = sd.IDSuKien
                JOIN LoaiVe lv ON lv.IDSuatDien = sd.IDSuatDien
                JOIN ChiTietHoaDon cthd ON cthd.IDLoaiVe = lv.IDLoaiVe
                WHERE sk.TrangThaiSuKien = 'Đã xác nhận'
                GROUP BY sk.IDSuKien
                ORDER BY TongVeBan DESC
                LIMIT 10;
            `;
            break;

        case 'GanNhatMua':
            sql = `
                SELECT sk.AnhNen, MAX(hd.NgayThanhToan) AS GanNhatMua
                FROM SuKien sk
                JOIN SuatDien sd ON sk.IDSuKien = sd.IDSuKien
                JOIN LoaiVe lv ON lv.IDSuatDien = sd.IDSuatDien
                JOIN ChiTietHoaDon cthd ON cthd.IDLoaiVe = lv.IDLoaiVe
                JOIN HoaDonMuaVe hd ON hd.IDHoaDon = cthd.IDHoaDon
                WHERE sk.TrangThaiSuKien = 'Đã xác nhận'
                GROUP BY sk.IDSuKien
                ORDER BY GanNhatMua DESC
                LIMIT 10;
            `;
            break;

        case 'SuKienCoVideo':
            sql = `
                SELECT IDSuKien, Video, AnhNen 
                FROM SuKien 
                WHERE Video IS NOT NULL AND TrangThaiSuKien = 'Đã xác nhận'
                LIMIT 6;
            `;
            break;

        case 'SuKienNormal':
            sql = `
                SELECT * 
                FROM SuKien 
                WHERE TrangThaiSuKien = 'Đã xác nhận'
                LIMIT 10;
            `;
            break;

        default:
            throw new Error('Invalid query type');
    }

    try {
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        console.error(`Lỗi query ${type}:`, error);
        throw error;
    }
};




export const getSuKienChiTietById = async (idSuKien) => {
    const sql = `
        SELECT 
            sk.IDSuKien,
            sk.TenSuKien,
            sk.DiaDiem,
            sk.ThongTinSuKien,
            sk.TrangThaiSuKien,
            sk.IDLoaiSuKien,
            lsk.TenLoai AS TenLoaiSuKien,
            sk.IDNguoiDung,
            sk.Logo,
            sk.AnhNen,
            sk.LogoBanToChuc,
            sk.TenBanToChuc,
            sk.ThongTinBanToChuc,
            sk.Video
        FROM SuKien sk
        JOIN LoaiSuKien lsk ON sk.IDLoaiSuKien = lsk.IDLoaiSuKien
        WHERE sk.IDSuKien = ?`;

    const [rows] = await pool.query(sql, [idSuKien]);
    return rows[0];
};


// Lấy sự kiện theo ID
export const getSuKienById = async (idSuKien) => {
    const sql = `
        SELECT *
        FROM SuatDien SD
        INNER JOIN SuKien SK ON SD.IDSuKien = SK.IDSuKien
        INNER JOIN LoaiVe LV ON SD.IDSuatDien = LV.IDSuatDien
        WHERE SK.IDSuKien = ?`;

    const [rows] = await pool.query(sql, [idSuKien]);

    return rows; 
};

export const getSuKienByIdUser = async (idNguoiDung) => {
    const sql = `
       select * from SuKien where IDNguoiDung = ?`;

    const [rows] = await pool.query(sql, [idNguoiDung]);

    return rows;
};


export const createSuKien = async (idSuKien, data) => {
    const values = [
        idSuKien,
        data.idLoaiSuKien,
        data.idNguoiDung,
        data.logo,
        data.anhNen,
        data.tenSuKien,
        data.diaDiem,
        data.thongTinSuKien,
        data.trangThaiSuKien || 'Chờ xác nhận',
        data.logoBanToChuc,
        data.tenBanToChuc,
        data.thongTinBanToChuc,
        data.video
    ];
    const [result] = await pool.query(
        `INSERT INTO SuKien 
        (IDSuKien, IDLoaiSuKien, IDNguoiDung, Logo, AnhNen, TenSuKien, DiaDiem, ThongTinSuKien, TrangThaiSuKien, LogoBanToChuc, TenBanToChuc, ThongTinBanToChuc, Video)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        values
    );
    return idSuKien;
};


// Cập nhật sự kiện
export const updateSuKien = async (id, suKien) => {
    try {
        const sql = "UPDATE SuKien SET ? WHERE IDSuKien = ?";
        const [result] = await pool.query(sql, [suKien, id]);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

// Xóa sự kiện
export const deleteSuKien = async (id) => {
    try {
        const sql = "DELETE FROM SuKien WHERE IDSuKien = ?";
        const [result] = await pool.query(sql, [id]);
        return result.affectedRows; 
    } catch (error) {
        throw error;
    }
};

export const DuyetSuKien = async (idSuKien) => {
    try{
        const sql = "UPDATE SuKien SET TrangThaiSuKien = 'Đã xác nhận' WHERE IDSuKien = ?";
        const [result] = await pool.query(sql, [idSuKien]);
        console.log(`DuyetSuKien: affectedRows = ${result.affectedRows}, idSuKien = ${idSuKien}`);
        return result.affectedRows[0];
    }catch (error) {
        throw error;
    }
}
