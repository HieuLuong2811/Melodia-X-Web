"use client";
import React from "react";
import dynamic from 'next/dynamic'
const LeftSide = dynamic(() => import('@/components/LeftSide-Admin'), { ssr: false })
const TopSize = dynamic(() => import('@/components/topSize-Admin.jsx'), { ssr: false })
import "./style.css";
import { TextField, Button } from "@mui/material";

const AccountInformation = () => {

  // const [dsVe, setDsVe] = useState<LoaiVe[] | null>(null);


  // useEffect(() => {
  //   const userData = localStorage.getItem("IDNguoiDung");
  //   if (userData) {
  //     LoaiVeService.getVeDaMuaByUserId(userData)
  //       .then((data) => {
  //         if (Array.isArray(data)) {
  //           setDsVe(data);
  //         } else {
  //           setDsVe([]); 
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Lỗi khi lấy danh sách vé:", error);
  //         setDsVe([]); 
  //       });
  //   }
  // }, []);

  // if (!dsVe) {
  //   return <p>Đang tải sự kiện...</p>;
  //   }   
  

  return (
    <>
      <LeftSide />
      <div id="right" className="overflow-auto" style={{ backgroundColor: "#F5F7FD" }}>
        <TopSize title="Order sự kiện" />
        <div className="container rounded-2 p-3 pt-3 mt-5">
          <div className="w-100 bg-white p-3 rounded">
            <div id="profile-container">
                <div className="profile-header ps-2 gap-2 pb-4 mb-2" style={{ borderBottom: "1px solid #CFCFCF" }} >
                  <h5>Hồ sơ của tôi</h5>
                  <p className="description m-0">
                    Quản lý thông tin hồ sơ để bảo mật tài khoản
                  </p>
                </div>
                <div className="profile-content d-flex justify-content-between">
                  <form className="col-md-6 d-block">
                    <table className="profile-table">
                        <tbody>
                            <tr>
                            <td className="label-col">
                                <label>Họ tên</label>
                            </td>
                            <td className="input-col">
                                <TextField
                                label="Họ tên"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                placeholder="Nhập họ tên"
                                name="tenNguoiDung"
                                // defaultValue={user?.tenNguoiDung}
                                />
                            </td>
                            </tr>
                            <tr>
                            <td className="label-col">
                                <label>Email</label>
                            </td>
                            <td className="input-col">
                                <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                placeholder="Nhập email"
                                name="email"
                                // defaultValue={user?.email}
                                />
                            </td>
                            </tr>
                            <tr>
                            <td className="label-col">
                                <label>Số điện thoại</label>
                            </td>
                            <td className="input-col">
                                <TextField
                                label="Số điện thoại"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                placeholder="Nhập số điện thoại"
                                name="soDienThoai"
                                // defaultValue={user?.soDienThoai}
                                />
                            </td>
                            </tr>
                            <tr>
                            <td className="label-col">
                                <label>Mật khẩu</label>
                            </td>
                            <td className="input-col">
                                <TextField
                                label="Mật khẩu"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                placeholder="Nhập mật khẩu"
                                name="matKhau"
                                type="password"
                                />
                            </td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                      <Button className="w-100" variant="contained" color="primary" type="submit">
                        Lưu
                      </Button>
                    </div>
                  </form>

                  <div className="upload-container p-5 pe-2 d-flex flex-column gap-2 text-center col-md-5" style={{borderLeft : "1px solid #000"}}>
                    <img src="https://salt.tkbcdn.com/ts/ds/e0/be/05/f22913827e013f1430639b83173ca039.jpg" alt="avatar" className="rounded-circle mx-auto" width={100} height={100} />
                    <input type="file" accept="image/*" />
                    <small className="text-muted">Định dạng: JPG, PNG (max 2MB)</small>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default AccountInformation;
