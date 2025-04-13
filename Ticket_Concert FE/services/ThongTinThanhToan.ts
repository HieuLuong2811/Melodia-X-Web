"use client";
import { ThongTinThanhToan } from "../interfaces/ThongTinThanhToan";
import axios from "axios";

const API_URL = "http://localhost:3000/api/GiaoDichs";

export const thongTinThanhToanService = {
  getAllThongTinThanhToans: async (): Promise<ThongTinThanhToan[]> => {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  },

  getThongTinThanhToansById: async (IDNguoiDung : string): Promise<ThongTinThanhToan> => {
    const response = await axios.get<ThongTinThanhToan>(`${API_URL}/${IDNguoiDung}`);
    return response.data;
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
