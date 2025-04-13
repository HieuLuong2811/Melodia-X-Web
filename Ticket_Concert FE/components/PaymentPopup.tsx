import React from "react";

interface CartItem {
  IDLoaiVe: string;
  TenLoaiVe: string;
  SoLuong: number;
  GiaTien: number;
}

interface PaymentPopupProps {
  cart: {
    chiTiet: CartItem[];
    tongTien: number;
    tongSoLuong: number;
  };
  formData: {
    agree: boolean;
    phone: string;
    email: string;
  };
  onClose: () => void;
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({ cart, formData, onClose }) => {
  // Hiển thị popup hoặc thực hiện xử lý thanh toán ở đây
  return (
    <div className="popup-overlay">
      <div className="popup-content bg-white p-4 rounded shadow">
        <h4 className="mb-3">Xác nhận thanh toán</h4>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Số điện thoại:</strong> {formData.phone}</p>
        <div className="mb-2">
          <strong>Chi tiết vé:</strong>
          {cart.chiTiet.map((item, idx) => (
            <div key={idx}>
              {item.TenLoaiVe} x {item.SoLuong} — {(item.SoLuong * item.GiaTien).toLocaleString()} đ
            </div>
          ))}
        </div>
        <p><strong>Tổng tiền:</strong> {cart.tongTien.toLocaleString()} đ</p>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary">Tiếp tục thanh toán</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;
