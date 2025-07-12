import axios from "axios";

const http = "http://localhost:3000/api";

export const LoginService = {
  Login: async (email : string, password : string) => {
    const response = await axios.post(`${http}/login`, {
        Email : email,
        MatKhau : password
    });
    return response.data;
  },

  Register: async (name: string, phone: string, email: string, password: string) => {
    const response = await axios.post(`${http}/register`, {
        TenNguoiDung: name,
        SoDienThoai: phone,
        Email: email,
        MatKhau: password,
    });
    return response.data;
  },
};
