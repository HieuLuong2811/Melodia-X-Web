"use client";
import axiosInstance  from "../middleware/axiosConfig";
import { SuKien } from "../interfaces/SuKien";


export const suKienService = {
  getAllSuKiens: async (): Promise<SuKien[]> => {
    const response = await axiosInstance.get('SuKiens');
    return response.data;
  },

  getSuKienById: async (): Promise<SuKien> => {
    const IDSuKien = localStorage.getItem("IDSuKien_User_Detail");
    const response = await axiosInstance.get<SuKien>(`'SuKiens'/${IDSuKien}`);
    return response.data;
  },

  createSuKien: async (data: Omit<SuKien, "IDSuKien">): Promise<SuKien> => {
    const response = await axiosInstance.post<SuKien>('SuKiens', data);
    return response.data;
  },

  updateSuKien: async (IDSuKien: string, data: Partial<SuKien>): Promise<SuKien> => {
    const response = await axiosInstance.put<SuKien>(`'SuKiens'/${IDSuKien}`, data);
    return response.data;
  },

  deleteSuKien: async (IDSuKien: string): Promise<void> => {
    await axiosInstance.delete(`'SuKiens'/${IDSuKien}`);
  },
};
