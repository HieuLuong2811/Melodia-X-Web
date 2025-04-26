"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { userService } from "@/services/NguoiDung"; 
import { NguoiDung } from "@/interfaces/NguoiDung";
import { TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import "./type.css"

const LeftSide = dynamic(() => import("@/components/LeftSide-Admin"), { ssr: false });
const TopSize = dynamic(() => import("@/components/topSize-Admin"), { ssr: false });

const UserPage = () => {
  const [users, setUsers] = useState<NguoiDung[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    userService.getAllUsers().then((data) => setUsers(data));
  }, []);

  const filteredUsers = users.filter(user => {
    const tenNguoiDung = user.TenNguoiDung?.toLowerCase() || "";
    const trangThai = user.TrangThai?.toLowerCase() || "";
    const userId = user.IDNguoiDung?.toLowerCase() || "";

    return (
      (tenNguoiDung.includes(searchName.toLowerCase())) &&
      (searchStatus ? trangThai === searchStatus.toLowerCase() : true) &&
      (searchId ? userId.includes(searchId.toLowerCase()) : true)
    );
  });

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <LeftSide />
      <div id="right" className="overflow-auto" style={{ backgroundColor: "#F5F7FD" }}>
        <TopSize title="Quản lý tài khoản người dùng" />

        <div className="tab-content d-flex flex-column align-items-center">
          <div className="container p-5 mt-5 rounded-3">
            <div className="form">
              <div className="container-form">
                <div className="between d-flex gap-3">
                  <TextField label="Tìm kiếm tên" fullWidth variant="outlined" value={searchName}
                    onChange={(e) => setSearchName(e.target.value)} />
                  <TextField label="Tìm kiếm ID người dùng" fullWidth variant="outlined" value={searchId}
                    onChange={(e) => setSearchId(e.target.value)} />
                  <FormControl fullWidth>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select value={searchStatus} label="Trạng thái"
                      onChange={(e) => setSearchStatus(e.target.value)}>
                      <MenuItem value="">Tất cả</MenuItem>
                      <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                      <MenuItem value="Khoá">Khoá</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                {/* Bảng danh sách người dùng */}
                <div className="table-responsive mt-4">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Giới tính</th>
                        <th>Ngày sinh</th>
                        <th>Quyền hạn</th>
                        <th>Trạng thái</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.IDNguoiDung}>
                            <td className="d-flex align-items-center gap-2">
                              <img src={"https://sigmawire.net/i/03/uXfhW2.png"} alt="Hình ảnh" className="rounded-circle" width="50" height="50" />
                              {user.TenNguoiDung}
                            </td>
                            <td>{user.Email}</td>
                            <td>{user.SoDienThoai}</td>
                            <td>{user.GioiTinh || "Chưa cập nhật"}</td>
                            <td>{user.NgaySinh ? new Date(user.NgaySinh).toLocaleDateString() : "Chưa cập nhật"}</td>
                            <td>
                              <span className={`badge ${user.QuyenHan === "Admin" ? "bg-danger" : "bg-secondary"}`}>
                                {user.QuyenHan}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${user.TrangThai === "Khoá" ? "bg-danger" : user.TrangThai === "Hoạt động" ? "bg-warning" : "bg-secondary"}`}>
                                {user.TrangThai}
                              </span>
                            </td>
                            <td>
                              <button
                                className={`btn btn-sm d-flex align-items-center gap-2 ${user.TrangThai === "Hoạt động" ? "btn-danger" : "btn-success"}`}
                                onClick={async () => {
                                  const newStatus = user.TrangThai === "Hoạt động" ? "Khoá" : "Hoạt động";
                                  try {
                                    await userService.lockOrUnlockUser(user.IDNguoiDung, { TrangThai: newStatus });
                                    console.log(user.TrangThai);

                                    setUsers((prevUsers) =>
                                      prevUsers.map((u) =>
                                        u.IDNguoiDung === user.IDNguoiDung ? { ...u, TrangThai: newStatus } : u
                                      )
                                    );
                                  } catch (error) {
                                    console.error("Lỗi cập nhật trạng thái người dùng:", error);
                                    alert("Cập nhật trạng thái thất bại");
                                  }
                                }}
                              >
                                <i className={`fas ${user.TrangThai === "Hoạt động" ? "fa-lock" : "fa-unlock"}`}></i>
                                {user.TrangThai === "Hoạt động" ? "Khoá tài khoản" : "Mở khoá"}
                              </button>
                            </td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center">Không có dữ liệu</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
