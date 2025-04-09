"use client";
import axios from "axios";
import { SuKienDetails } from "../interfaces/SuKienDetails";

const API_URL = "http://localhost:3000/api/SuKiens";

export const suKienDetailsService = {

  getSuKienById: async (IDSuKien: string): Promise<SuKienDetails> => {
    const response = await axios.get<SuKienDetails>(`${API_URL}/${IDSuKien}`);
    return response.data;
  },
};
