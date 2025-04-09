import axiosInstance  from "../middleware/axiosConfig";
import { LoaiSuKien } from "../interfaces/LoaiSuKien";
import axios from "axios";


export const LoaisuKienService = {
  getAllLoaiSuKiens: async (): Promise<LoaiSuKien[]> => {
    const response = await axios.get(`http://localhost:3000/api/LoaiSuKiens`);
    return response.data;
  },

  getLoaiSuKienById: async (IDLoaiSuKien: string): Promise<LoaiSuKien> => {
    const response = await axiosInstance.get<LoaiSuKien>(`LoaiSuKiens/${IDLoaiSuKien}`);
    return response.data;
  },
};
