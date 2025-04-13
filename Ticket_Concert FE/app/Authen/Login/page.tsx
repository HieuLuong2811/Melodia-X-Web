"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button
} from "@mui/material";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  const tab = [
    {id: "login", lable: "Đăng nhập"},
    {id: "Register", lable: "Đăng ký"}
  ];


  const handleSubmit = async () => {

    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        Email: email,
        MatKhau: password,
      });

      console.log("Phản hồi từ server:", response.data);

      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("IDNguoiDung", response.data.userId);
        localStorage.setItem("AnhNenUser", response.data.avatar);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  return (
    <>
    <div className="container">
      <div className="d-flex justify-content-between">
        <div>
          <img src="" alt="" />
        </div>
        <ul className="nav ps-2 nav-tabs nav-line d-flex fs-4 nav-color-secondary p-0 border-0 align-items-center" role="tablist">
          {tab.map((tab) => (
          <li className="nav-item submenu" role="presentation" key={tab.id}>
            <button className={`p-2 d-flex align-items-center fs-5 justify-content-center gap-2 fw-bold border-0 bg-transparent rounded-0 nav-link ${
              activeTab === tab.id ? "active" : ""}`} style={{width : "200px"}} onClick={() => setActiveTab(tab.id)}>
              {tab.lable}
            </button>
          </li>
          ))}
        </ul>
      </div>

    
      {activeTab === "login" && (
        <div className="bg-white p-3 d-flex flex-column gap-4"> 
          <TextField label="Email" type="email" variant="outlined" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)}/>

          <TextField label="Mật khẩu" type="password" variant="outlined" fullWidth required value={password} onChange={(e) => setPassword(e.target.value)}/>
          <Button type="submit" onClick={() => handleSubmit()} variant="contained" color="primary" fullWidth>
            Đăng nhập
          </Button>
        </div>       
      )}
      {activeTab === "Register" && (
        <div>
          
          <TextField label="Email"
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
        </div>
      )}
    </div>
    </>
  );
};

export default LoginForm;
