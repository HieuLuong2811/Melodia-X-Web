import pool from '../config/db.js';

// Helper function to extract event type data
const getLoaiSuKienData = (loaiSuKien) => {
    return [
        loaiSuKien.tenLoai
    ];
};

// Model for LoaiSuKien
export const getAllLoaiSuKien = async () => {
    const [rows] = await pool.query('SELECT * FROM LoaiSuKien');
    return rows;    
};

export const getLoaiSuKienByID = async (idLoaiSuKien) => {
    const [rows] = await pool.query('SELECT * FROM LoaiSuKien WHERE IDLoaiSuKien = ?', [idLoaiSuKien]);
    return rows[0];
};

export const createLoaiSuKien = async (idLoaiSuKien, loaiSuKien) => {
    const data = getLoaiSuKienData(loaiSuKien);
    await pool.query(
        'INSERT INTO LoaiSuKien (IDLoaiSuKien, TenLoai) VALUES (?, ?)',
        [idLoaiSuKien, ...data]
    );
    return idLoaiSuKien;
};

export const updateLoaiSuKien = async (idLoaiSuKien, loaiSuKien) => {
    const data = getLoaiSuKienData(loaiSuKien);
    await pool.query(
        'UPDATE LoaiSuKien SET TenLoai = ?  WHERE IDLoaiSuKien = ?',
        [...data, idLoaiSuKien]
    );
};

export const deleteLoaiSuKien = async (idLoaiSuKien) => {
    await pool.query('DELETE FROM LoaiSuKien WHERE IDLoaiSuKien = ?', [idLoaiSuKien]);
};


