"use client";
import axiosInstance  from "../middleware/axiosConfig";
import { SuatDien } from "../interfaces/SuatDien";


export const SuatDienService = {
  getAllSuatDiens: async (): Promise<SuatDien[]> => {
    const response = await axiosInstance.get('SuatDiens');
    return response.data;
  },

  getbyIDSuKien: async (IDSuKien : string): Promise<SuatDien[]> => {
    const response = await axiosInstance.get(`SuatDiens/${IDSuKien}`)
    return response.data;
  },

  createSuatDiens: async(data : Omit<SuatDien, 'IDSuatDien'>) : Promise<SuatDien> => {
    const response = await axiosInstance.post<SuatDien>('SuatDiens', data);
    return response.data;
  },

  updateSuatDiens: async (IDSuatDien: string, data: Partial<SuatDien>): Promise<SuatDien> => {
    const response = await axiosInstance.put<SuatDien>(`SuatDiens/${IDSuatDien}`, data);
    return response.data;
  },

  deleteSuatDiens: async (IDSuatDien: string): Promise<void> => {
    await axiosInstance.delete(`SuatDiens/${IDSuatDien}`);
  },
};
