"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "./style.css";
import { OnlyDate } from "@/components/DisplayEventTime";
import { TextField, Button } from "@mui/material";
import { LoaiVeService } from "@/services/LoaiVe";
import AccBankInformation from "./My-Bank/page";
import { LoaiVe2 } from "@/interfaces/LoaiVe";
const EmptyData = dynamic(() => import('@/components/emptydata'));import { NguoiDung } from "@/interfaces/NguoiDung";
import {userService} from "@/services/NguoiDung";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EventIcon from '@mui/icons-material/Event';
const Nav = dynamic(() => import("@/components/Navbar.jsx"), { ssr: false });

const AccountInformation = () => {
  const [activeTab, setActiveTab] = useState("accountInfo");

  const [dsVe, setDsVe] = useState<LoaiVe2[]>([]);
  const[dsUser, setDSUser] = useState<NguoiDung | null>(null);

  

  useEffect(() => {
    const userData = localStorage.getItem("IDNguoiDung");
    if (userData) {
      LoaiVeService.getVeDaMuaByUserId(userData).then((data) => {
        if(data) {
          const result = Array.isArray(data) ? data : [data];
          setDsVe(result);
      }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách vé:", error);
          setDsVe([]);
        });
    }
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("IDNguoiDung");
    if (userData) {
      userService.getUserById(userData).then((data) => {
        if(data) {
          setDSUser(data);
      }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách vé:", error);
          setDsVe([]);
        });
    }
  }, []);

  if (!dsVe) {
    return <div className="loading-wrapper d-flex flex-column align-items-center gap-2">
      <p>Đang tải sự kiện...</p>
      <div className="d-flex align-items-center gap-3">
        <div className="loading set_1"></div>
        <div className="loading set_2"></div>
        <div className="loading set_3"></div>
      </div>
    </div>;
  }

  return (
    <>
      <div style={{zoom : "0.9"}}>
        <Nav />
        <div className="px-5 mx-5 d-flex justify-content-between mt-3 pb-3 gap-3">
          
          {/* Sidebar */}
          <nav className="d-flex p-3 bg-white rounded flex-column col-md-3 gap-2">
            <div className="d-flex ps-2 gap-2 pb-3 mb-2 bg-white" style={{ borderBottom: "1px solid #CFCFCF" }}>
              <img src="https://salt.tkbcdn.com/ts/ds/e0/be/05/f22913827e013f1430639b83173ca039.jpg" className="rounded-5" width={65} height={65} alt=""/>
              <div className="d-flex rounded flex-column gap-1">
                <p className="m-0">Tài khoản của</p>
                <span className="fs-4">{dsUser?.TenNguoiDung}</span>
              </div>
            </div>
            <ul className="left-sidebar d-flex flex-column gap-3 text-dark list-unstyled">
              <Link href="#" className="text-decoration-none text-dark" onClick={() => setActiveTab("accountInfo")}>
                <li className="p-3 d-flex align-items-center gap-2">
                  <AccountCircleIcon />
                  <span>Thông tin cá nhân</span>
                </li>
              </Link>

              <Link href="#" className="text-decoration-none text-dark" onClick={() => setActiveTab("purchasedTickets")}>
                <li className="p-3 d-flex align-items-center gap-2">
                  <ConfirmationNumberIcon />
                  <span>Vé đã mua</span>
                </li>
              </Link>

              <Link href="#" className="text-decoration-none text-dark" onClick={() => setActiveTab("bankacc")}>
                <li className="p-3 d-flex align-items-center gap-2">
                  <AccountBalanceIcon />
                  <span>Thông tin tài khoản</span>
                </li>
              </Link>

              <Link href="/Organizer/Organi-Event/my-event" target="blank" className="text-decoration-none text-dark">
                <li className="p-3 d-flex align-items-center gap-2">
                  <EventIcon />
                  <span>Sự kiện của tôi</span>
                </li>
              </Link>
            </ul>
          </nav>

          {/* Main Content */}
          <div className="col-md-9 bg-white p-3 rounded">
            {activeTab === "accountInfo" && (
              <div id="profile-container">
                <div className="profile-header ps-2 gap-2 pb-4 mb-2" style={{ borderBottom: "1px solid #CFCFCF" }}>
                  <h5>Hồ sơ của tôi</h5>
                  <p className="description m-0">
                    Quản lý thông tin hồ sơ để bảo mật tài khoản
                  </p>
                </div>
                <div className="profile-content d-flex justify-content-between">
                  <form className="col-md-6">
                    <table className="profile-table">
                      <tbody>
                        <tr>
                          <td className="label-col">
                            <label>Họ tên</label>
                          </td>
                          <td className="input-col">
                            <TextField value={dsUser?.TenNguoiDung || ""} label="Tên người dùng"  variant="outlined" fullWidth margin="normal" placeholder="Nhập họ tên" name="TenNguoiDung"/>
                          </td>
                        </tr>
                        <tr>
                          <td className="label-col">
                            <label>Email</label>
                          </td>
                          <td className="input-col">
                            <TextField value={dsUser?.Email || ""} label="Email" variant="outlined" fullWidth margin="normal" placeholder="Nhập email" name="email"/>
                          </td>
                        </tr>
                        <tr>
                          <td className="label-col">
                            <label>Số điện thoại</label>
                          </td>
                          <td className="input-col">
                            <TextField value={dsUser?.SoDienThoai || ""} label="Số điện thoại" variant="outlined" fullWidth margin="normal" placeholder="Nhập số điện thoại" name="soDienThoai" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div>
                      <Button variant="contained" color="primary" type="submit">
                        Lưu
                      </Button>
                    </div>
                  </form>

                  <div className="upload-container p-5 pe-2 d-flex flex-column gap-2 text-center col-md-5"
                    style={{ borderLeft: "1px solid #000" }}>
                    <img src="https://salt.tkbcdn.com/ts/ds/e0/be/05/f22913827e013f1430639b83173ca039.jpg" alt="avatar" className="rounded-circle mx-auto" width={100} height={100}/>
                    <input type="file" accept="image/*" />
                    <small className="text-muted">
                      Định dạng: JPG, PNG (max 2MB)
                    </small>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "purchasedTickets" && (
              <div>
                <h5 className="mb-3">Vé đã mua</h5>
                {dsVe.length === 0 ? (
                  <div className="sc-ffc90067-7 sc-cd78c11b-1 fFJbAL ePwTxf text-center">
                    <EmptyData />
                    <div className="sc-cd78c11b-2 cimqQp fw-bold mt-3">Bạn chưa có vé nào</div>
                    <div className="w-100 text-center mt-5">
                      <Link href="/">
                        <button className="btn btn-success">Mua vé ngay</button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead className="thead-dark">
                        <tr>
                          <th className="text-center" scope="col">STT</th>
                          <th scope="col">Tên sự kiện</th>
                          <th scope="col">Tên vé</th>
                          <th className="text-center" scope="col">Giá vé</th>
                          <th className="text-center" scope="col">Số lượng</th>
                          <th className="text-center" scope="col">Ngày thanh toán</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dsVe.slice()
                        .sort((a, b) => new Date(b.NgayThanhToan).getTime() - new Date(a.NgayThanhToan).getTime())
                        .map((ve, index) => (
                          <tr key={ve.IDLoaiVe || index}>
                            <td className="text-center">{index + 1}</td>
                            <td style={{width : "35%"}}>{ve.TenSuKien}</td>
                            <td style={{width : "20%"}}>{ve.TenVe}</td>
                            <td className="text-center">{ve.GiaVe}</td>
                            <td className="text-center">{ve.SoLuong}</td>
                            <td>
                              <div className="text-center">
                                <OnlyDate date={ve.NgayThanhToan}/>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "bankacc" && (
              <AccBankInformation />
            )}
          </div>
        </div>
      </div>
     
    </>
  );
};

export default AccountInformation;
