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
        const [rows] = await pool.query("SELECT * FROM SuKien");
        return rows;
    } catch (error) {
        throw error;
    }
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

// Thêm mới sự kiện
export const createSuKien = async (idSuKien, suKien) => {
    const sukienData = getSuKiendata(suKien);

    const [result] = await pool.query(
        `INSERT INTO SuKien 
        (IDSuKien, IDLoaiSuKien, IDNguoiDung, Logo, AnhNen, TenSuKien, DiaDiem, ThongTinSuKien, TrangThaiSuKien, LogoBanToChuc, TenBanToChuc, ThongTinBanToChuc)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [idSuKien, ...sukienData]
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
