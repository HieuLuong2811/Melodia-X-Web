import axiosInstance  from "../middleware/axiosConfig";
import { SuKien, SuKienDetails } from "../interfaces/SuKien";
import axios from "axios";

const API_URL = "http://localhost:3000/api/Admin/SuKiens";

// Dịch vụ xử lý sự kiện
export const suKienService = {

  getAllEvents: async (): Promise<SuKien[]> => {
    const response = await axiosInstance.get<SuKien[]>(`http://localhost:3000/api/Admin/SuKiensList`);
    return response.data;
  },

  CountSuKiens: async (): Promise<SuKien[]> => {
    const response = await axiosInstance.get<SuKien[]>(`http://localhost:3000/api/Admin/CountSuKiens`);
    return response.data; 
},

  getSuKienChiTiet: async (IDSuKien: string): Promise<SuKien> => {
      const response = await axiosInstance.get<SuKien>(`${API_URL}/${IDSuKien}`, {});
      return response.data;
    },
  

  createEvent: async (data: Omit<SuKien, "IDSuKien">): Promise<SuKien> => {
    const response = await axiosInstance.post<SuKien>(API_URL, data);
    return response.data;
  },


  getSuKienById: async (IDSuKien: string): Promise<SuKienDetails> => {
    const response = await axios.get<SuKienDetails>(`http://localhost:3000/api/SuKiens/${IDSuKien}`);
    return response.data;
  },

  updateEvent: async (IDSuKien: string, data: Partial<SuKien>): Promise<SuKien> => {
    const response = await axiosInstance.put<SuKien>(`${API_URL}/${IDSuKien}`, data);
    return response.data;
  },

  DuyetSuKien : async (IDSuKien : string, IDNguoiDung: string, trangThaiSuKien : string): Promise<SuKien> => {
    const response = await axiosInstance.put<SuKien>(`http://localhost:3000/api/Admin/DuyetSuKien/${IDSuKien}?idNguoiDung=${IDNguoiDung}`, {trangThaiSuKien});
    return response.data;
  }
};
