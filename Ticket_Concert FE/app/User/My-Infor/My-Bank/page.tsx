"use client";
import React, { useState,useEffect } from "react";
import { TextField, Button, MenuItem,Select, InputLabel, FormControl } from "@mui/material";
import { ThongTinThanhToan } from "@/interfaces/ThongTinThanhToan";
import { thongTinThanhToanService } from "@/services/ThongTinThanhToan";

const AccBankInformation = () => {
    const [acc, setAcc] = useState<ThongTinThanhToan | null>(null)

    useEffect(() => {
        const userData = localStorage.getItem("IDNguoiDung");
        if (userData) {
        thongTinThanhToanService.getThongTinThanhToansById(userData).then((data) => {
            if(data) {
            setAcc(data);
        }
            })
            .catch((error) => {
            console.error("Lỗi khi lấy danh sách vé:", error);
            });
        }
    }, []);

    if (!acc) {
        return <div className="loading-wrapper d-flex flex-column align-items-center gap-2">
        <p>Đang tải thông tin...</p>
        <div className="d-flex align-items-center gap-3">
            <div className="loading set_1"></div>
            <div className="loading set_2"></div>
            <div className="loading set_3"></div>
        </div>
        </div>;
    }

  return (
    <>
    <div id="profile-container">
        <div className="profile-header ps-2 gap-2 pb-4 mb-2" style={{ borderBottom: "1px solid #CFCFCF" }}>
            <h5>Thông tin tài khoản của tôi</h5>
            <p className="description m-0">
            Quản lý thông tin ngân hàng
            </p>
        </div>
        <div className="profile-content d-flex justify-content-between">
            <form className="col-md-6">
                <table className="profile-table">
                    <tbody>
                        <tr>
                            <td className="label-col">
                            <label>Chủ tài khoản</label>
                            </td>
                            <td className="input-col">
                            <TextField value={acc?.ChuTaiKhoan || ""} label="Chủ tài khoản"  variant="outlined" fullWidth margin="normal" placeholder="Nhập Chủ tài khoản" name="chuTaiKhoan"/>
                            </td>
                        </tr>
                        <tr>
                            <td className="label-col">
                            <label>Số tài khoản</label>
                            </td>
                            <td className="input-col">
                            <TextField value={acc?.SoTaiKhoan} label="Số tài khoản" variant="outlined" fullWidth margin="normal" placeholder="Số tài khoản" name="soTaiKhoan"/>
                            </td>
                        </tr>
                        <tr>
                            <td className="label-col">
                                <label>Chi nhánh</label>
                            </td>
                            <td className="input-col">
                                <TextField value={acc?.ChiNhanh} label="Chi nhánh"  variant="outlined" fullWidth margin="normal" placeholder="Nhập chi nhánh" name="ChiNhanh" type="ChiNhanh"/>
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
            </form>

            <div className="upload-container col-md-6  d-flex flex-column gap-2 text-center col-md-5">
                <div className="d-flex align-items-center">
                    <div className="label-col">
                        <label>Loại hình</label>
                    </div>
                    <div className="input-col w-75">
                        <FormControl fullWidth margin="normal">
                        <InputLabel id="loaiHinh-label">Loại hình</InputLabel>
                        <Select labelId="loaiHinh-label"
                            label="Loại hình"
                            name="loaiHinh"
                            value={acc?.LoaiHinh}
                            defaultValue="">
                            <MenuItem value="Doanh nghiệp">Doanh nghiệp</MenuItem>
                            <MenuItem value="Cá nhân">Cá nhân</MenuItem>
                        </Select>
                        </FormControl>
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <div className="label-col">
                        <label>Tên ngân hàng</label>
                    </div>
                    <div className="input-col w-75">
                        <FormControl fullWidth margin="normal">
                        <InputLabel id="tenNganHang-label">Tên ngân hàng</InputLabel>
                        <Select
                            labelId="tenNganHang-label"
                            label="Tên ngân hàng"
                            name="tenNganHang"
                            value={acc?.TenNganHang}
                            defaultValue="">
                            <MenuItem value="MB Bank">MB Bank</MenuItem>
                            <MenuItem value="Agribank">Agribank</MenuItem>
                            <MenuItem value="Vietcombank">Vietcombank</MenuItem>
                            <MenuItem value="BIDV">BIDV</MenuItem>
                            <MenuItem value="Techcombank">Techcombank</MenuItem>
                            <MenuItem value="ACB">ACB</MenuItem>
                            <MenuItem value="Sacombank">Sacombank</MenuItem>
                            <MenuItem value="VPBank">VPBank</MenuItem>
                            <MenuItem value="VietinBank">VietinBank</MenuItem>
                            <MenuItem value="TPBank">TPBank</MenuItem>
                            <MenuItem value="SHB">SHB</MenuItem>
                            <MenuItem value="HDBank">HDBank</MenuItem>
                            <MenuItem value="SCB">SCB</MenuItem>
                            <MenuItem value="MSB">MSB</MenuItem>
                            <MenuItem value="OCB">OCB</MenuItem>
                            <MenuItem value="Eximbank">Eximbank</MenuItem>
                            <MenuItem value="DongA Bank">DongA Bank</MenuItem>
                            <MenuItem value="NCB">NCB</MenuItem>
                            <MenuItem value="Nam A Bank">Nam A Bank</MenuItem>
                            <MenuItem value="SeABank">SeABank</MenuItem>
                        </Select>
                        </FormControl>
                    </div>
                </div>
                <div className="w-100">
                    <Button className="w-50" variant="contained" color="primary" type="submit">
                        Lưu
                    </Button>
                </div>
            </div>
        </div>
    </div>
    </>
  );
};

export default AccBankInformation;
