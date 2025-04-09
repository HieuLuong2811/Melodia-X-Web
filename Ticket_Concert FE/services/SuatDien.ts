"use client";
import axiosInstance  from "../middleware/axiosConfig";
import { SuatDien } from "../interfaces/SuatDien";


export const suKienService = {
  getAllSuatDiens: async (): Promise<SuatDien[]> => {
    const response = await axiosInstance.get('SuatDiens');
    return response.data;
  },

  createSuatDiens: async (data: Omit<SuatDien, "IDSuatDien">): Promise<SuatDien> => {
    const response = await axiosInstance.post<SuatDien>('SuKiens', data);
    return response.data;
  },

  updateSuatDiens: async (IDSuatDien: string, data: Partial<SuatDien>): Promise<SuatDien> => {
    const response = await axiosInstance.put<SuatDien>(`'SuKiens'/${IDSuatDien}`, data);
    return response.data;
  },

  deleteSuatDiens: async (IDSuatDien: string): Promise<void> => {
    await axiosInstance.delete(`'SuKiens'/${IDSuatDien}`);
  },
};
