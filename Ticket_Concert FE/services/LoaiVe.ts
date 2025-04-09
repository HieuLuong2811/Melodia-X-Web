import axiosInstance  from "../middleware/axiosConfig";
import { LoaiVe, LoaiVe2 } from "../interfaces/LoaiVe.ts";

export const LoaiVeService = {
  getAllSuKiens: async (): Promise<LoaiVe[]> => {
    const response = await axiosInstance.get<LoaiVe[]>('LoaiSuKiens');
    return response.data;
  },

  getVeDaMuaByUserId: async (IDNguoiDung: string): Promise<LoaiVe2[]> => {
    const response = await axiosInstance.get(`http://localhost:3000/api/LoaiVesDaMua/${IDNguoiDung}`);
    return response.data
  },
  

  getSuKienByIdSuatDien: async (IDSuatDien: string): Promise<LoaiVe> => {
    const response = await axiosInstance.get<LoaiVe>(`http://localhost:3000/api/LoaiVes/SuatDiens/${IDSuatDien}`);
    return response.data;
  },

  createSuKien: async (data: Omit<LoaiVe, "IDLoaiSuKien">): Promise<LoaiVe> => {
    const response = await axiosInstance.post<LoaiVe>('LoaiSuKiens', data);
    return response.data;
  },

  updateSuKien: async (IDLoaiSuKien: string, data: Partial<LoaiVe>): Promise<LoaiVe> => {
    const response = await axiosInstance.put<LoaiVe>(`'LoaiSuKiens'/${IDLoaiSuKien}`, data);
    return response.data;
  },

  deleteSuKien: async (IDLoaiSuKien: string): Promise<void> => {
    await axiosInstance.delete(`'LoaiSuKiens'/${IDLoaiSuKien}`);
  },
};
