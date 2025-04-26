'use client';
import {ThanhVien} from '../interfaces/ThanhVien';
import axiosInstance from '@/middleware/axiosConfig';

const URL = "http://localhost:3000/api/ThanhViens";

export const ThanhVienService = {
    GetThanhVienByID: async (IDSuKien: string): Promise<ThanhVien[]> => {
      const response = await axiosInstance.get<ThanhVien[]>(`${URL}/${IDSuKien}`);
      return response.data;
    },
  
    CreateThanhVien: async (data: ThanhVien) => {
      const response = await axiosInstance.post(URL, data);
      return response.data;
    },
  
    UpdateThanhVien: async (id: string, data: Partial<ThanhVien>) => {
      const response = await axiosInstance.put(`${URL}/${id}`, data);
      return response.data;
    },
  
    DeleteThanhVien: async (id: string) => {
      const response = await axiosInstance.delete(`${URL}/${id}`);
      return response.data;
    }
  };
  