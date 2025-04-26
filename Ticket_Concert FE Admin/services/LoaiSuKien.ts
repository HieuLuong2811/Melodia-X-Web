import axiosInstance  from "../middleware/axiosConfig";
import { LoaiSuKien } from "../interfaces/LoaiSuKien";


export const LoaisuKienService = {
  getAllLoaiSuKiens: async (): Promise<LoaiSuKien[]> => {
    const response = await axiosInstance.get<LoaiSuKien[]>('LoaiSuKiens');
    return response.data;
  },

  getLoaiSuKienById: async (IDLoaiSuKien: string): Promise<LoaiSuKien> => {
    const response = await axiosInstance.get<LoaiSuKien>(`LoaiSuKiens/${IDLoaiSuKien}`);
    return response.data;
  },

  createLoaiSuKien: async (data: Omit<LoaiSuKien, "IDLoaiSuKien">): Promise<LoaiSuKien> => {
    const response = await axiosInstance.post<LoaiSuKien>('LoaiSuKiens', data);
    return response.data;
  },

  updateLoaiSuKien: async (IDLoaiSuKien: string, data: Partial<LoaiSuKien>): Promise<LoaiSuKien> => {
    const response = await axiosInstance.put<LoaiSuKien>(`LoaiSuKiens/${IDLoaiSuKien}`, data);
    return response.data;
  },

  deleteLoaiSuKien: async (IDLoaiSuKien: string): Promise<void> => {
    await axiosInstance.delete(`LoaiSuKiens/${IDLoaiSuKien}`);
  },
};
