"use client";
import React, { useState, useContext } from "react"; 
import AuthContext  from "../context/AuthContext";

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, MatKhau: password }),
      });
 
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      login(data.userId, data.token); 
      onClose(); 
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Đăng nhập</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input type="email" placeholder="Email" className="form-control mb-2"
              value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Mật khẩu" className="form-control mb-2"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={handleLogin}>Đăng nhập</button>
            <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
