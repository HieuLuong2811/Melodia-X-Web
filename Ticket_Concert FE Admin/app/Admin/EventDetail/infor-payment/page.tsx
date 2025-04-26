"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { thongTinThanhToanService } from "@/services/ThongTinThanhToan";
import { ThongTinThanhToan } from "@/interfaces/ThongTinThanhToan";


const PaymentInvoiceForm = () => {
  const [paymentInfo, setPaymentInfo] = useState<ThongTinThanhToan | null>(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin thanh toán từ API dựa trên IDNguoiDung-Detail
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const idNguoiDungDetail = localStorage.getItem("IDNguoiDung-Detail");
        if (!idNguoiDungDetail) {
          setLoading(false);
          return;
        }

        const data = await thongTinThanhToanService.getThongTinThanhToansById(idNguoiDungDetail);
        if (data) {
          setPaymentInfo(data);
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

  if (loading) return <div className="loading-wrapper d-flex flex-column align-items-center gap-2">
  <p>Đang tải...</p>
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

      <div className="mb-3">
        <label className="form-label border-0">Chủ tài khoản:</label>
        <input
          type="text"
          className="form-control w-100"
          maxLength={100}
          value={paymentInfo?.ChuTaiKhoan || "Chưa có thông tin"}
          readOnly
        />
      </div>
      <div className="mb-3">
        <label className="form-label border-0">Số tài khoản:</label>
        <input
          type="text" // Đổi thành text để hiển thị số tài khoản chính xác
          className="form-control w-100"
          maxLength={100}
          value={paymentInfo?.SoTaiKhoan || "Chưa có thông tin"}
          readOnly
        />
      </div>
      <div className="mb-3">
        <label className="form-label border-0">Tên ngân hàng:</label>
        <input
          type="text"
          className="form-control w-100"
          maxLength={100}
          value={paymentInfo?.TenNganHang || "Chưa có thông tin"}
          readOnly
        />
      </div>
      <div className="mb-3">
        <label className="form-label border-0">Chi nhánh:</label>
        <input
          type="text"
          className="form-control w-100"
          maxLength={100}
          value={paymentInfo?.ChiNhanh || "Chưa có thông tin"}
          readOnly
        />
      </div>
      <div className="mb-3">
        <label className="form-label border-0">Loại hình kinh doanh:</label>
        <input
          type="text"
          className="form-control w-100"
          value={paymentInfo?.LoaiHinh || "Chưa có thông tin"}
          readOnly
        />
      </div>
    </div>
  );
};

export default PaymentInvoiceForm;