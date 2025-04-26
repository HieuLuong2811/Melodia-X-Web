"use client";
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { TextField, Button } from "@mui/material";

const LoginForm = () => {
  const [activeTab, setActiveTab] = useState("login");

  // Đăng nhập
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Đăng ký
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const tab = [
    { id: "login", label: "Đăng nhập" },
    { id: "register", label: "Đăng ký" },
  ];

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        Email: email,
        MatKhau: password,
      });

      // Nếu đăng nhập thành công
      if (response.status === 200) {
        const { userId, token, avatar, trangThai } = response.data;

        if (trangThai === "Khoá") {
          Swal.fire({
            icon: "error",
            title: "Tài khoản bị khóa",
            text: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
          });
          return;
        }

        localStorage.setItem("authToken", token);
        localStorage.setItem("IDNguoiDung", userId);
        localStorage.setItem("AnhNenUser", avatar);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      Swal.fire({
        icon: "error",
        title: "Đăng nhập thất bại",
        text: "Đã có lỗi xảy ra khi đăng nhập.",
      });
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Mật khẩu không khớp",
        text: "Vui lòng kiểm tra lại mật khẩu.",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/register", {
        TenNguoiDung: name,
        SoDienThoai: phone,
        Email: email,
        MatKhau: password,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Đăng ký thành công!",
          text: "Vui lòng đăng nhập để tiếp tục.",
        });

        // Reset form & chuyển về tab đăng nhập
        setActiveTab("login");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setPhone("");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      Swal.fire({
        icon: "error",
        title: "Đăng ký thất bại",
        text: "Đã có lỗi xảy ra khi đăng ký.",
      });
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between">
        <div>
          <img src="/logo.jpg" alt="" />
        </div>
        <ul className="nav ps-2 nav-tabs nav-line d-flex fs-4 nav-color-secondary p-0 border-0 align-items-center" role="tablist">
          {tab.map((tabItem) => (
            <li className="nav-item submenu" role="presentation" key={tabItem.id}>
              <button
                className={`p-2 d-flex align-items-center fs-5 justify-content-center gap-2 fw-bold border-0 bg-transparent rounded-0 nav-link ${
                  activeTab === tabItem.id ? "active" : ""
                }`}
                style={{ width: "200px" }} onClick={() => setActiveTab(tabItem.id)}>
                {tabItem.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {activeTab === "login" && (
        <div className="bg-white p-3 d-flex flex-column gap-4">
          <TextField label="Email" type="email" variant="outlined" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)}/>
          <TextField label="Mật khẩu" type="password" variant="outlined" fullWidth required value={password} onChange={(e) => setPassword(e.target.value)}/>
          <Button type="submit" onClick={handleLogin} variant="contained" color="primary" fullWidth>
            Đăng nhập
          </Button>
        </div>
      )}

      {activeTab === "register" && (
        <div className="bg-white p-3 d-flex flex-column gap-4">
          <TextField label="Tên người dùng" type="text" variant="outlined" fullWidth required value={name} onChange={(e) => setName(e.target.value)}/>
          <TextField label="Số điện thoại" type="text" variant="outlined" fullWidth required value={phone} onChange={(e) => setPhone(e.target.value)}/>
          <TextField label="Email" type="email" variant="outlined" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)}/>
          <TextField label="Mật khẩu" type="password" variant="outlined" fullWidth required value={password} onChange={(e) => setPassword(e.target.value)}/>
          <TextField label="Nhắc lại mật khẩu" type="password" variant="outlined" fullWidth required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          <Button type="submit" onClick={handleRegister} variant="contained" color="primary" fullWidth>
            Tạo tài khoản
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
