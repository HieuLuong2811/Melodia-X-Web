import { NguoiDung } from "../interfaces/NguoiDung";
import axiosInstance  from "../middleware/axiosConfig";

// Dịch vụ xử lý người dùng
export const userService = {
  getAllUsers: async (): Promise<NguoiDung[]> => {
    const response = await axiosInstance.get('/nguoidungs');
    return response.data;
  },

  getUserById: async (IDNguoiDung: string): Promise<NguoiDung> => {
    const response = await axiosInstance.get<NguoiDung>(`/nguoidungs/${IDNguoiDung}`); 
    return response.data;
  },

  createUser: async (data: Omit<NguoiDung, "IDNguoiDung">): Promise<NguoiDung> => {
    const response = await axiosInstance.post<NguoiDung>('/nguoidungs', data); 
    return response.data;
  },

  updateUser: async (IDNguoiDung: string, data: Partial<NguoiDung>): Promise<NguoiDung> => {
    const response = await axiosInstance.put<NguoiDung>(`/nguoidungs/${IDNguoiDung}`, data); 
    return response.data;
  },

  lockOrUnlockUser: async (IDNguoiDung: string, data: Partial<NguoiDung>): Promise<NguoiDung> => {
    const response = await axiosInstance.put<NguoiDung>(`http://localhost:3000/api/NguoiDungTrangThai/${IDNguoiDung}`,{ trangThai: data.TrangThai }); 
    return response.data;
  },

  deleteUser: async (IDNguoiDung: string): Promise<void> => {
    await axiosInstance.delete(`/nguoidungs/${IDNguoiDung}`); 
  },
};
