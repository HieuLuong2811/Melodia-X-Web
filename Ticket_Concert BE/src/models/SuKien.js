import pool from '../config/db.js';


const getSuKiendata = (suKien) => {
    return [  
        suKien.idLoaiSuKien,          
        suKien.idNguoiDung,           
        suKien.logo,                   
        suKien.anhNen,                 
        suKien.tenSuKien,              
        suKien.diaDiem,               
        suKien.thongTinSuKien,         
        suKien.trangThaiSuKien,     
        suKien.logoBanToChuc,          
        suKien.tenBanToChuc,           
        suKien.thongTinBanToChuc      
    ];
};

// Lấy tất cả sự kiện
export const getAllSuKien = async () => {
    try {
        const [rows] = await pool.query("SELECT * FROM SuKien WHERE TrangThaiSuKien in ('Đã xác nhận', 'Chưa bắt đầu', 'Đang diễn ra', 'Hoàn thành')");
        return rows;
    } catch (error) {
        throw error;
    }
};

export const getAllSuKienAdmin = async () => {
    try {
        const [rows] = await pool.query("SELECT * FROM SuKien");
        return rows;
    } catch (error) {
        throw error;
    }
};

export const GetSuKienHaveVideo = async () => {
    
}

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
