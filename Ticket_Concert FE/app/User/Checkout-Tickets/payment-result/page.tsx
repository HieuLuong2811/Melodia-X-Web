"use client";
import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const PaymentResult = () => {

  useEffect(() => {
    const handlePaymentResult = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const resultCode = urlParams.get("resultCode");
      const orderId = urlParams.get("orderId"); 

      if (!orderId) {
        Swal.fire("Lỗi", "Không tìm thấy ID hóa đơn", "error");
        return;
      }

      if (resultCode === "0") {
        Swal.fire("Thành công", "Thanh toán thành công!", "success");
        sessionStorage.removeItem("invoice");
        sessionStorage.removeItem("countdownTime");
        window.location.href = "http://localhost:3005/User/My-Infor";
      } else {
        try {
          await axios.delete(`http://localhost:3000/api/HoaDons/${orderId}`);
        } catch (err) {
          console.error("Xoá hóa đơn lỗi", err);
        }

        sessionStorage.removeItem("invoice");
        sessionStorage.removeItem("countdownTime");

        Swal.fire("Thất bại", "Thanh toán thất bại hoặc bị huỷ.", "error");
      }
    };

    handlePaymentResult();
  }, []);

  return <div className="text-center mt-5">Đang xử lý kết quả thanh toán...</div>;
};

export default PaymentResult;
