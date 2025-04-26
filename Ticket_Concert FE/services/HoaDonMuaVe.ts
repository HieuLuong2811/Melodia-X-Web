// import axiosInstance from "@/middleware/axiosConfig";
import { HoaDonMuaVe,HoaDonMua } from "@/interfaces/HoaDonMuaVe";
import axios from "axios";

const API_URL = "http://localhost:3000/api/HoaDons";

export const HoaDonMuaService = {
    createHoaDon: async (data: Omit<HoaDonMuaVe, "IDHoaDon">): Promise<HoaDonMuaVe> => {
        const response = await axios.post<HoaDonMuaVe>(API_URL, data);
        return response.data;
    },

    getHoaDonByIDSuatDien : async(IDSuatDien : string): Promise<HoaDonMua[]> => {
        const response = await axios.get<HoaDonMua[]>(`http://localhost:3000/api/HoaDonsBySuatDien/${IDSuatDien}`);
        return response.data;
    }
}