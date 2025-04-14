"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { thongTinThanhToanService } from "@/services/ThongTinThanhToan";
import { ThongTinThanhToan } from "@/interfaces/ThongTinThanhToan";

const Payment = () => {
  const [paymentInfo, setPaymentInfo] = useState<ThongTinThanhToan | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [idThongTin, setIdThongTin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tempPaymentInfo, setTempPaymentInfo] = useState<ThongTinThanhToan>({
    IDThongTin: "",
    IDNguoiDung: "",
    ChuTaiKhoan: "",
    SoTaiKhoan: "",
    TenNganHang: "",
    ChiNhanh: "",
    LoaiHinh: "Cá nhân",
  });

  // Lấy thông tin thanh toán từ API
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const idNguoiDung = localStorage.getItem("IDNguoiDung");
        if (!idNguoiDung) {
          setLoading(false);
          return;
        }

        const data = await thongTinThanhToanService.getThongTinThanhToansById(idNguoiDung);
        if (data) {
          setPaymentInfo(data);
          setTempPaymentInfo(data);
          setIdThongTin(data.IDThongTin);
          setIsEdit(true);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin thanh toán:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải thông tin thanh toán.",
          timer: 2000,
          showConfirmButton: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentInfo();
  }, []);

  // Hàm xử lý thay đổi input trong popup
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTempPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Mở popup để thêm hoặc sửa
  const openPopup = (editMode: boolean = false) => {
    if (editMode && paymentInfo) {
      setTempPaymentInfo(paymentInfo); // Load thông tin hiện tại để sửa
    } else {
      setTempPaymentInfo({
        IDThongTin: "",
        IDNguoiDung: localStorage.getItem("IDNguoiDung") || "",
        ChuTaiKhoan: "",
        SoTaiKhoan: "",
        TenNganHang: "",
        ChiNhanh: "",
        LoaiHinh: "Cá nhân",
      }); // Reset để thêm mới
    }
    setShowPopup(true);
  };

  // Lưu hoặc cập nhật thông tin thanh toán
  const handleSavePaymentInfo = async () => {
    const { ChuTaiKhoan, SoTaiKhoan, TenNganHang, ChiNhanh, LoaiHinh } = tempPaymentInfo;
    if (!ChuTaiKhoan || !SoTaiKhoan || !TenNganHang || !ChiNhanh) {
      Swal.fire({
        icon: "error",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập đầy đủ thông tin!",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const idNguoiDung = localStorage.getItem("IDNguoiDung");
    if (!idNguoiDung) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tìm thấy ID người dùng!",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const payload: Omit<ThongTinThanhToan, "IDThongTin"> = {
      IDNguoiDung: idNguoiDung,
      ChuTaiKhoan,
      SoTaiKhoan,
      TenNganHang,
      ChiNhanh,
      LoaiHinh,
    };

    try {
      if (!isEdit) {
        const created = await thongTinThanhToanService.createThongTinThanhToans(payload);
        setPaymentInfo({ ...payload, IDThongTin: created.IDThongTin });
        setIdThongTin(created.IDThongTin);
        setIsEdit(true);
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Tạo thông tin thanh toán thành công.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else if (idThongTin) {
        await thongTinThanhToanService.updateThongTinThanhToans(idThongTin, payload);
        setPaymentInfo({ ...payload, IDThongTin: idThongTin });
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setShowPopup(false);
    } catch (error) {
      console.error("Lỗi lưu thông tin:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể lưu thông tin.",
      });
    }
  };

  if (loading) return <div className="loading-wrapper d-flex flex-column align-items-center gap-2">
  <p>Đang tải thông tin...</p>
  <div className="d-flex align-items-center gap-3">
    <div className="loading set_1"></div>
    <div className="loading set_2"></div>
    <div className="loading set_3"></div>
  </div>
</div>;;

  return (
    <div className="p-3 rounded bg-dark text-light">
      <h5 className="fw-bold">Thông tin thanh toán</h5>
      <p className="text-white">
          Melodia-X sẽ chuyển tiền bán vé đến tài khoản của bạn.
          <br />
          Tiền bán vé (sau khi trừ phí dịch vụ cho Melodia-X) sẽ vào tài khoản của bạn sau khi xác nhận sale report từ 7 - 10 ngày.
          <br />
          Nếu bạn muốn nhận được tiền sớm hơn, vui lòng liên hệ chúng tôi qua số 1900.6408 hoặc info@Melodia-X.vn
      </p>
        
      {/* Hiển thị thông tin readonly */}
      <div className="d-flex justify-content-between gap-3">
        <div className="w-50">
          <div className="mb-3">
            <label className="form-label">Chủ tài khoản:</label>
            <input
              type="text"
              className="w-100 form-control"
              value={paymentInfo?.ChuTaiKhoan || "Chưa có thông tin"}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Số tài khoản:</label>
            <input
              type="text" // Đổi thành text để tránh lỗi định dạng số
              className="w-100 form-control"
              value={paymentInfo?.SoTaiKhoan || "Chưa có thông tin"}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tên ngân hàng:</label>
            <input
              type="text"
              className="w-100 form-control"
              value={paymentInfo?.TenNganHang || "Chưa có thông tin"}
              readOnly
            />
          </div>
        </div>
        <div className="col-md-5">
          <div className="mb-3">
            <label className="form-label">Chi nhánh:</label>
            <input
              type="text"
              className="w-100 form-control"
              value={paymentInfo?.ChiNhanh || "Chưa có thông tin"}
              readOnly
            />
          </div>
          <div className="mb-5">
            <label className="form-label">Loại hình kinh doanh:</label>
            <input
              type="text"
              className="w-100 form-control"
              value={paymentInfo?.LoaiHinh || "Chưa có thông tin"}
              readOnly
            />
          </div>
          <div className="text-end">
            <button
              className="btn btn-primary me-2"
              onClick={() => openPopup(false)}
            >
              Thêm
            </button>
            {isEdit && (
              <button className="btn btn-success" onClick={() => openPopup(true)}>
                Sửa
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Popup để thêm hoặc sửa */}
      {showPopup && (
        <div
          className="popup-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="popup bg-dark text-light p-4 rounded" style={{ width: "500px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{isEdit ? "Sửa thông tin thanh toán" : "Thêm thông tin thanh toán"}</h5>
              <span className="fs-5 cursor-pointer" onClick={() => setShowPopup(false)}>
                ❌
              </span>
            </div>
            <div className="mb-3">
              <label className="form-label">Chủ tài khoản:</label>
              <input
                type="text"
                className="w-100 form-control"
                name="ChuTaiKhoan"
                value={tempPaymentInfo.ChuTaiKhoan}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Số tài khoản:</label>
              <input
                type="text" // Đổi thành text để tránh lỗi định dạng số
                className="w-100 form-control"
                name="SoTaiKhoan"
                value={tempPaymentInfo.SoTaiKhoan}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tên ngân hàng:</label>
              <input
                type="text"
                className="w-100 form-control"
                name="TenNganHang"
                value={tempPaymentInfo.TenNganHang}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Chi nhánh:</label>
              <input
                type="text"
                className="w-100 form-control"
                name="ChiNhanh"
                value={tempPaymentInfo.ChiNhanh}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Loại hình kinh doanh:</label>
              <select
                className="form-select"
                name="LoaiHinh"
                value={tempPaymentInfo.LoaiHinh}
                onChange={handleInputChange}
              >
                <option value="Cá nhân">Cá nhân</option>
                <option value="Doanh nghiệp">Doanh nghiệp</option>
              </select>
            </div>
            <div className="text-end">
              <button
                className="btn btn-success w-100"
                onClick={handleSavePaymentInfo}
              >
                {isEdit ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;