"use client"
import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import Swal from "sweetalert2"; 

const TicketQRWarning = () => {
  const handleCreateEvent = async () => {
    try {
      const danhSachSuKien = JSON.parse(sessionStorage.getItem("danhSachSuKien") || "[]");
      const danhSachSuatDien = JSON.parse(sessionStorage.getItem("danhSachSuatDien") || "[]");
      const danhSachLoaiVe = JSON.parse(sessionStorage.getItem("danhSachLoaiVe") || "[]");

      if (
        !danhSachSuKien.length ||
        !danhSachSuatDien.length ||
        !danhSachLoaiVe.length
      ) {
        Swal.fire({
          icon: "error",
          title: "Thiếu thông tin",
          text: "Vui lòng nhập đầy đủ thông tin ở các bước trước!",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }

      const requestBody = {
        danhSachSuKien,
        danhSachSuatDien,
        danhSachLoaiVe,
      };

      const response = await axios.post("http://localhost:3000/api/SuKiens", requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, 
        },
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Sự kiện đã được tạo thành công.",
          timer: 2000,
          showConfirmButton: false,
        });
        sessionStorage.clear();
        localStorage.removeItem("uploadedMedia_background");
        localStorage.removeItem("uploadedMedia_logo");
        localStorage.removeItem("uploadedMedia_logoOrganizer");
        localStorage.removeItem("uploadedMedia_video");
        localStorage.removeItem("IDLoaiSuKien_Organizer");
        window.location.href = "/Organizer/Organi-Event/my-event/";
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi tạo sự kiện.",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo sự kiện:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi khi tạo sự kiện. Vui lòng thử lại.",
      });
    }
  };

  // Dữ liệu giả lập QR
  const orderId = "ORD123456";
  const buyerInfo = { name: "Nguyễn Văn A", email: "nguyenvana@example.com", phone: "0987654321" };
  const tickets = [
    { id: "TCK001", type: "VIP", price: "500,000 VND" },
    { id: "TCK002", type: "Standard", price: "300,000 VND" },
  ];

  return (
    <>
    <div className="justify-content-between mb-2 d-flex align-items-center">
      <h4 className="alert-heading m-0">Lưu ý cho Ban tổ chức sự kiện!</h4>
      <button className="btn btn-success w-25" onClick={handleCreateEvent}>Tạo sự kiện</button>
    </div>
    <div className="alert alert-warning d-flex fs-5 justify-content-between align-items-start p-3" role="alert">   
      <div>
        <p>
          Khi người dùng mua vé thành công, hệ thống sẽ tạo một <strong>mã QR</strong> duy nhất cho mỗi hóa đơn bán. <br />
          Mã QR này sẽ được quét khi vào cổng để xác nhận thông tin. <br />
        </p>
        <ul>
          <li>Mỗi mã QR chứa thông tin đơn hàng, người mua và vé đã mua.</li>
          <li>Nhân viên tại sự kiện sẽ quét mã QR để xác nhận vé.</li>
          <li>Sau khi quét, hệ thống sẽ hiển thị thông tin chi tiết về đơn hàng.</li>
          <li>Không chia sẻ mã QR với người khác để tránh rủi ro lạm dụng.</li>
        </ul>
        <p className="mb-0"><strong>Đảm bảo hệ thống quét mã QR hoạt động ổn định!</strong></p>
      </div>
      <div className="ms-3 col-md-5 text-center">
        <p>Mã QR mẫu nếu mua hàng thành công</p>
        <QRCodeCanvas value={JSON.stringify({ orderId, buyerInfo, tickets })} className="w-50 p-3" size={250} />
      </div>
    </div>
    </>
  );
};

export default TicketQRWarning;