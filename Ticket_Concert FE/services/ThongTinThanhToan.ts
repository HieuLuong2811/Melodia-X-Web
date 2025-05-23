"use client";
import { ThongTinThanhToan } from "../interfaces/ThongTinThanhToan";
import axios from "axios";

const API_URL = "http://localhost:3000/api/GiaoDichs";

export const thongTinThanhToanService = {

  getThongTinThanhToansById: async (IDNguoiDung: string): Promise<ThongTinThanhToan | null> => {
  try {
    const response = await axios.get<ThongTinThanhToan>(`${API_URL}/${IDNguoiDung}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn("Không tìm thấy thông tin thanh toán cho người dùng:", IDNguoiDung);
      return null; 
    }

    console.error("Lỗi khi lấy thông tin thanh toán:", error);
    throw error;
  }
 },


  createThongTinThanhToans: async (data: Omit<ThongTinThanhToan, "IDThongTin">): Promise<ThongTinThanhToan> => {
    const response = await axios.post<ThongTinThanhToan>(`${API_URL}`, data);
    return response.data;
  },

  updateThongTinThanhToans: async (IDThongTin: string, data: Partial<ThongTinThanhToan>): Promise<ThongTinThanhToan> => {
    const response = await axios.put<ThongTinThanhToan>(`${API_URL}/${IDThongTin}`, data);
    return response.data;
  },

  deleteThongTinThanhToans: async (IDThongTin: string): Promise<void> => {
    await axios.delete(`${API_URL}/${IDThongTin}`);
  },
};
