import axiosInstance  from "../middleware/axiosConfig";
import { LoaiVe, LoaiVe2 } from "../interfaces/LoaiVe.ts";

export const LoaiVeService = {
  getVeDaMuaByUserId: async (IDNguoiDung: string): Promise<LoaiVe2[]> => {
    const response = await axiosInstance.get(`http://localhost:3000/api/LoaiVesDaMua/${IDNguoiDung}`);
    return response.data
  },

  getLoaiVesByIdSuatDien: async (IDSuatDien: string): Promise<LoaiVe> => {
    const response = await axiosInstance.get<LoaiVe>(`http://localhost:3000/api/LoaiVes/SuatDiens/${IDSuatDien}`);
    return response.data;
  },

  createLoaiVe: async (data: LoaiVe) => {
    const response = await axiosInstance.post('LoaiVes', data);
    return response.data;
  },

  updateLoaiVe: async (IDLoaiVe: string, data: Partial<LoaiVe>): Promise<LoaiVe> => {
    const response = await axiosInstance.put<LoaiVe>(`http://localhost:3000/api/LoaiVes/${IDLoaiVe}`, data);
    return response.data;
  },

  deleteLoaiVe: async (IDLoaiVe: string): Promise<void> => {
    await axiosInstance.delete(`LoaiVes/${IDLoaiVe}`);
  },
};
