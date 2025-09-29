import axiosInstance from "../middleware/axiosConfig";
import { KhuVuc } from "../interfaces/KhuVuc";

export const KhuVucService = {
  getAllKhuVucs: async (): Promise<KhuVuc[]> => {
    const response = await axiosInstance.get<KhuVuc[]>('KhuVucs');
    return response.data;
  },

  getKhuVucById: async (IDKhuVuc: string): Promise<KhuVuc> => {
    const response = await axiosInstance.get<KhuVuc>(`KhuVucs/${IDKhuVuc}`);
    return response.data;
  },
};
