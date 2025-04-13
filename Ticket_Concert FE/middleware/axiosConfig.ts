import axios from 'axios';

const API_URL = 'http://localhost:3000/api';  

const axiosInstance = axios.create({
  baseURL: API_URL,  
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      window.location.href = "/Authen/Login/";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
