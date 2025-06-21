// services/DashBoard.ts
"use client";
import axios from "axios";
import { SoLuongVe, DoanhThu, VeTonKho } from '../interfaces/DashBoard';

export const dashboardService = {
  getdoanhthu: async (IDSuatDien: string): Promise<DoanhThu> => {
    const response = await axios.get<DoanhThu>(`http://localhost:3000/api/doanhthu/${IDSuatDien}`);
    return response.data;
  },

  getVeDaBan: async (IDSuatDien : string): Promise<SoLuongVe> => {
    const response = await axios.get<SoLuongVe>(`http://localhost:3000/api/soluongve/${IDSuatDien}`);
    return response.data;
  },

  getVeTonKho: async (IDSuatDien: string): Promise<VeTonKho> => {
    const response = await axios.get<VeTonKho>(`http://localhost:3000/api/soluongvetonkho/${IDSuatDien}`);
    return response.data;
  },
};