import { ThongBao } from "@/interfaces/ThongBao";
import axiosInstance from "@/middleware/axiosConfig";

const URL = "http://localhost:3000/api/thongBao";

export const ThongBaoService = {
    GetThongBaoByIDuser: async (IDNguoiDung: string): Promise<ThongBao[]> => {
        const response = await axiosInstance.get<ThongBao[]>(`${URL}/${IDNguoiDung}`);
        return response.data;
    }
}