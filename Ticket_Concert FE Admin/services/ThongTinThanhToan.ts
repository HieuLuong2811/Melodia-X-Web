"use client";
import { ThongTinThanhToan } from "../interfaces/ThongTinThanhToan";
import axios from "axios";

const API_URL = "http://localhost:3000/api/GiaoDichs";

export const thongTinThanhToanService = {
  getThongTinThanhToansById: async (IDNguoiDung : string): Promise<ThongTinThanhToan> => {
    const response = await axios.get<ThongTinThanhToan>(`${API_URL}/${IDNguoiDung}`);
    return response.data;
  },
};
