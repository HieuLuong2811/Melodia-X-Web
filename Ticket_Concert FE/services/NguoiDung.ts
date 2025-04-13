import axios from "axios";
import { NguoiDung } from "../interfaces/NguoiDung";
import axiosInstance from "@/middleware/axiosConfig";

const API_URL = "http://localhost:3000/api/nguoidungs";

// Dịch vụ xử lý người dùng
export const userService = {
  getAllUsers: async (): Promise<NguoiDung[]> => {
    const response = await axios.get<NguoiDung[]>(API_URL); 
    return response.data;
  },

  getUserById: async (IDNguoiDung: string): Promise<NguoiDung> => {
    const response = await axiosInstance.get<NguoiDung>(`${API_URL}/${IDNguoiDung}`); 
    return response.data;
  },

  createUser: async (data: Omit<NguoiDung, "IDNguoiDung">): Promise<NguoiDung> => {
    const response = await axios.post<NguoiDung>(API_URL, data); 
    return response.data;
  },

  updateUser: async (IDNguoiDung: string, data: Partial<NguoiDung>): Promise<NguoiDung> => {
    const response = await axios.put<NguoiDung>(`${API_URL}/${IDNguoiDung}`, data); 
    return response.data;
  },

  deleteUser: async (IDNguoiDung: string): Promise<void> => {
    await axios.delete(`${API_URL}/${IDNguoiDung}`); 
  },
};
