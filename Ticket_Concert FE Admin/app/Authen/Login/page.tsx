"use client";
import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Checkbox, FormControlLabel } from "@mui/material";
import { useRouter } from 'next/navigation';
import "../../Authen/style.css";
import Link from "next/link";
import Swal from "sweetalert2";

const LoginForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  // Hàm gửi yêu cầu đăng nhập bằng Axios
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        Email : email,
        MatKhau : password
        
      });

      console.log("Phản hồi từ server:", response.data); 

      if(response.data.QuyenHan == "User") {
        Swal.fire({
          icon : "error",
          title: "Lỗi Quyền hạn",
          text: "Bạn không có quyền truy cập",
          timer: 2000,
          showConfirmButton: false,
        })  
      }
      else {
        if (response.status === 200) {
          Swal.fire({
            icon : "success",
            title: "Đăng nhập thành công",
            text: "Chào mừng quản trị viên hệ thống",
            timer: 3000,
            showConfirmButton: false,
          })  
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("IDNguoiDung", response.data.userId);
          localStorage.setItem("AnhNen", response.data.avatar);
          router.push('/');
        }
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setErrorMessage("Đăng nhập thất bại. Kiểm tra lại email/mật khẩu.");
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
      />

      <Box
        component="form"
        className="bg-white p-4"
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: 500, margin: "auto", mt: 5 }}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Mật khẩu"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <div className="text-danger">{errorMessage}</div>}
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex w-50 gap-2">
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={handleChange} />}
              label="Ghi nhớ tài khoản"
            />
          </div>
          <div>
            <Link className="text-decoration-none" href="#">
              Quên mật khẩu ?
            </Link>
          </div>
        </div>
        <Button type="submit" variant="contained" color="primary">
          Đăng nhập
        </Button>
        <div className="d-flex align-items-center">
          <i className="fa-brands fa-facebook"></i>
          <i className="fa-brands fa-twitter"></i>
        </div>
      </Box>
    </>
  );
};

export default LoginForm;
