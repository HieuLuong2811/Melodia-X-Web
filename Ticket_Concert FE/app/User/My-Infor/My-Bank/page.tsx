"use client";

import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from "@mui/material";
import { ThongTinThanhToan } from "@/interfaces/ThongTinThanhToan";
import { thongTinThanhToanService } from "@/services/ThongTinThanhToan";
import Swal from "sweetalert2";

const AccBankInformation = () => {
  const [acc, setAcc] = useState<ThongTinThanhToan>({
    IDThongTin: "",
    IDNguoiDung: "",
    ChuTaiKhoan: "",
    SoTaiKhoan: "",
    ChiNhanh: "",
    TenNganHang: "",
    LoaiHinh: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("IDNguoiDung");
    if (!userId) return;

    thongTinThanhToanService.getThongTinThanhToansById(userId)
      .then((data) => {
        if (data) {
          setAcc(data);
          setIsExisting(true); 
        }
      })
      .catch(() => {
        console.log("Chưa có thông tin tài khoản, cần tạo mới");
      })
      .finally(() => {
        setAcc((prev) => ({ ...prev, IDNguoiDung: userId! })); 
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setAcc((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const confirmMessage = isExisting
        ? "Bạn có chắc chắn muốn cập nhật thông tin tài khoản?"
        : "Bạn có chắc chắn muốn tạo mới thông tin tài khoản?";
  
      const result = await Swal.fire({
        title: 'Xác nhận',
        text: confirmMessage,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
      });
  
      if (result.isConfirmed) {
        if (isExisting) {
          await thongTinThanhToanService.updateThongTinThanhToans(acc.IDThongTin, acc);
          Swal.fire('Thành công!', 'Cập nhật thông tin tài khoản thành công.', 'success');
        } else {
          await thongTinThanhToanService.createThongTinThanhToans(acc);
          Swal.fire('Thành công!', 'Tạo thông tin tài khoản thành công.', 'success');
          setIsExisting(true);
        }
      } else {
      }
    } catch (error) {
      console.error("Lỗi lưu thông tin:", error);
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi, vui lòng thử lại.', 'error');
    }
  };
  

  if (isLoading) {
    return (
      <div className="loading-wrapper d-flex flex-column align-items-center gap-2">
        <p>Đang tải thông tin...</p>
        <div className="d-flex align-items-center gap-3">
          <div className="loading set_1"></div>
          <div className="loading set_2"></div>
          <div className="loading set_3"></div>
        </div>
      </div>
    );
  }

  return (
    <div id="profile-container">
      <div className="profile-header ps-2 gap-2 pb-4 mb-2" style={{ borderBottom: "1px solid #CFCFCF" }}>
        <h5>Thông tin tài khoản của tôi</h5>
        <p className="description m-0">Quản lý thông tin ngân hàng</p>
      </div>

      <form className="profile-content d-flex justify-content-between" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <table className="profile-table">
            <tbody>
              <tr>
                <td className="label-col">
                  <label>Chủ tài khoản</label>
                </td>
                <td className="input-col">
                  <TextField
                    name="ChuTaiKhoan"
                    value={acc.ChuTaiKhoan}
                    onChange={handleChange}
                    label="Chủ tài khoản"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    placeholder="Nhập chủ tài khoản"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-col">
                  <label>Số tài khoản</label>
                </td>
                <td className="input-col">
                  <TextField
                    name="SoTaiKhoan"
                    value={acc.SoTaiKhoan}
                    onChange={handleChange}
                    label="Số tài khoản"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    placeholder="Nhập số tài khoản"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-col">
                  <label>Chi nhánh</label>
                </td>
                <td className="input-col">
                  <TextField
                    name="ChiNhanh"
                    value={acc.ChiNhanh}
                    onChange={handleChange}
                    label="Chi nhánh"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    placeholder="Nhập chi nhánh"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="upload-container col-md-6 d-flex flex-column gap-2 text-center">
          <div className="d-flex align-items-center">
            <div className="label-col">
              <label>Loại hình</label>
            </div>
            <div className="input-col w-75">
              <FormControl fullWidth margin="normal">
                <InputLabel id="loaiHinh-label">Loại hình</InputLabel>
                <Select
                  labelId="loaiHinh-label"
                  name="LoaiHinh"
                  value={acc.LoaiHinh}
                  onChange={handleChange}
                  label="Loại hình"
                >
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
                  name="TenNganHang"
                  value={acc.TenNganHang}
                  onChange={handleChange}
                  label="Tên ngân hàng"
                >
                  {["MB Bank", "Agribank", "Vietcombank", "BIDV", "Techcombank", "ACB", "Sacombank", "VPBank", "VietinBank", "TPBank", "SHB", "HDBank", "SCB", "MSB", "OCB", "Eximbank", "DongA Bank", "NCB", "Nam A Bank", "SeABank"].map((bank) => (
                    <MenuItem key={bank} value={bank}>
                      {bank}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="w-100">
            <Button className="w-50" variant="contained" color="primary" type="submit">
              Lưu thông tin
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccBankInformation;
