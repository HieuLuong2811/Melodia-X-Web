"use client";
import axiosInstance  from "../middleware/axiosConfig";
import { SuKien,SuKienNormal } from "../interfaces/SuKien";
import axios from "axios";


export const suKienService = {
  getAllSuKiens: async (): Promise<SuKienNormal[]> => {
    const response = await axios.get<SuKienNormal[]>(`http://localhost:3000/api/SuKiens`);
    return response.data;
  },

  getTitleEvent: async (): Promise<SuKien[]> => {
    const response = await axios.get<SuKien[]>(`http://localhost:3000/api/Title-Event`);
    return response.data;
  },

  getSuKienTongVeBan : async (): Promise<SuKien[]> => {
    const response = await axios.get<SuKien[]>(`http://localhost:3000/api/Special-Event`);
    return response.data;
  },

  getSuKienGanNhatMua : async (): Promise<SuKien[]> => {
    const response = await axios.get<SuKien[]>(`http://localhost:3000/api/Trending-Events`);
    return response.data;
  },

  getSuKienById: async (): Promise<SuKien> => {
    const IDSuKien = localStorage.getItem("IDSuKien_User_Detail");
    const response = await axiosInstance.get<SuKien>(`'SuKiens'/${IDSuKien}`);
    return response.data;
  },

  getSuKienByIdUser: async (IDNguoiDung : string): Promise<SuKien> => {
    const response = await axios.get<SuKien>(`http://localhost:3000/api/SuKiensUser/${IDNguoiDung}`);
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
