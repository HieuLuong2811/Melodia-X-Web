"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LoaiVe } from "@/interfaces/LoaiVe";
import { LoaiVeService } from "@/services/LoaiVe";
import "./Book-Tickets.css";
import { useSearchParams } from 'next/navigation';

const TicketBooking = () => {

  const [LoaiVes, SetLoaiVe] = useState<LoaiVe[]>([]);
  const [cart, setCart] = useState<{ IDLoaiVe: string; TenLoaiVe: string; SoLuong: number; GiaTien: number }[]>([]);

  const [hovered, setHovered] = useState(false);

  const [tenSuKien, setTenSuKien] = useState("");
  const [diaDiem, setDiaDiem] = useState("");
  const [thoiGianBatDau, setThoiGianBatDau] = useState("");
  const [thoiGianKetThuc, setThoiGianKetThuc] = useState("");
  const [soDoGhe, setSoDoGhe] = useState("");

  const searchParams = useSearchParams();
  const id_detail = searchParams.get("id_detail");

  useEffect(() => {
    const suatdienRaw = sessionStorage.getItem("suatInfo");
    const savedCart = sessionStorage.getItem("invoice");

    if (suatdienRaw) {
      try {
        const suatdien = JSON.parse(suatdienRaw);

        LoaiVeService.getLoaiVesByIdSuatDien(suatdien.IDSuatDien).then((data: LoaiVe | LoaiVe[]) => {
          if (data) {
            SetLoaiVe(Array.isArray(data) ? data : [data]);
          }
        });

        setTenSuKien(suatdien.TenSuKien);
        setDiaDiem(suatdien.DiaDiem);
        setThoiGianBatDau(suatdien.ThoiGianBatDau);
        setThoiGianKetThuc(suatdien.ThoiGianKetThuc);
        setSoDoGhe(suatdien.AnhSoDoGhe);
      } catch (err) {
        console.error("Parse suatInfo error:", err);
      }
    }

    try {
      const parsedCart = JSON.parse(savedCart || "[]");
      setCart(Array.isArray(parsedCart) ? parsedCart : []);
    } catch (err) {
      console.error("Cart parse error:", err);
      setCart([]);
    }
  }, []);
  
  useEffect(() => {
    const tongTien = cart.reduce((sum, item) => sum + item.SoLuong * item.GiaTien, 0);
    const tongSoLuong = cart.reduce((sum, item) => sum + item.SoLuong, 0);
    const cartData = {
      items: cart,
      tongTien,
      tongSoLuong
    };
    sessionStorage.setItem("invoice", JSON.stringify(cartData));
  }, [cart]);
  
  // Tăng số lượng vé
  const increaseQuantity = (ticket: LoaiVe) => {
    if (!ticket.IDLoaiVe) return; 
    setCart((prevCart) => {
      const existingTicket = prevCart.find((item) => item.IDLoaiVe === ticket.IDLoaiVe);
      if (existingTicket) {
        return prevCart.map((item) =>
          item.IDLoaiVe === ticket.IDLoaiVe ? { ...item, SoLuong: item.SoLuong + 1 } : item
        );
      } else {
        return [
          ...prevCart,
          {
            IDLoaiVe: ticket.IDLoaiVe as string,
            TenLoaiVe: ticket.TenVe,
            SoLuong: 1,
            GiaTien: ticket.GiaVe,
          },
        ];
      }
    });
  };

  // Giảm số lượng vé
  const decreaseQuantity = (ticket: LoaiVe) => {
    setCart((prevCart) => {
      const existingTicket = prevCart.find((item) => item.IDLoaiVe === ticket.IDLoaiVe);
      if (existingTicket) {
        if (existingTicket.SoLuong === 1) {
          return prevCart.filter((item) => item.IDLoaiVe !== ticket.IDLoaiVe);
        } else {
          return prevCart.map((item) =>
            item.IDLoaiVe === ticket.IDLoaiVe ? { ...item, SoLuong: item.SoLuong - 1 } : item
          );
        }
      }
      return prevCart;
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.SoLuong * item.GiaTien, 0);

  const createInvoice = () => {

    // Lấy tổng số vé
    const tongSoVe = cart.reduce((sum, item) => sum + item.SoLuong, 0);
  
    // Định dạng ngày thanh toán
    const now = new Date();
    const NgayThanhToan = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  
    const invoice = {
      idNguoiDung: localStorage.getItem("IDNguoiDung") || "", 
      tongSoVe: tongSoVe,
      ngayThanhToan: NgayThanhToan,
      tongTien: totalAmount,
      phuongThucThanhToan: "Momo", 
      TrangThaiThanhToan: "Chưa thanh toán",
      chiTiet: cart.map((item) => ({
        idLoaiVe: item.IDLoaiVe,
        tenLoaiVe : item.TenLoaiVe,
        soLuong: item.SoLuong,
        giaTien: item.GiaTien,
        trangThaiVe: "Chưa sử dụng", 
      })),
    };
  
    sessionStorage.setItem("invoice", JSON.stringify(invoice));
    return invoice;
  };
  
  if (LoaiVes.length === 0) {
    return <div className="loading-wrapper d-flex flex-column align-items-center gap-2">
      <p>Đang tải danh sách vé...</p>
      <div className="d-flex align-items-center gap-3">
        <div className="loading set_1"></div>
        <div className="loading set_2"></div>
        <div className="loading set_3"></div>
      </div>
    </div>;
  }

  return (
    <>
      <div style={{height : "100%", zoom : "0.9"}}>
        <nav className="navbar navbar-expand-lg navbar-light pt-3 pb-3 position-sticky top-0 z-3">
          <div className="container justify-content-center">        
            <Link href="/">
              <img src="/logo_User.png" style={{ height : "60px"}} alt="Logo" />
            </Link>
          </div>
        </nav>
        <div className="container-fluid bg-black text-light vh-100 overflow-hidden">
          <div className="row h-100 d-flex justify-content-between">
            <div className="col-md-6 p-3 flex-grow-1 text-center" style={{ overflowY: "auto", height: "100vh", scrollbarWidth: "none" }}>
              <div className="d-flex align-items-center justify-content-between fs-5">
                <Link
                  href={`/User/Event-Details/?id_detail=${id_detail}`}
                  className="text d-flex align-items-center text-decoration-none"
                  onClick={() => {
                    localStorage.removeItem("TenSuKien");
                    localStorage.removeItem("ThoiGianBatDau");
                    localStorage.removeItem("ThoiGianKetThuc");
                    localStorage.removeItem("IDSuatDien");
                    localStorage.removeItem("DiaDiem");
                    sessionStorage.removeItem("cart")
                    sessionStorage.removeItem("suatInfo");
                  }}>
                  <i className="bi bi-arrow-left-short text-white fs-3 me-2"></i>
                  <p className="m-0">Trở về</p>
                </Link>
                <span className="text flex-grow-1 text-center">Chọn vé</span>
              </div>

              <div className="container ps-5 pe-5">
                <div className="d-flex justify-content-between mt-5">
                  <h5 className="fw-bold">Loại vé</h5>
                  <h5 className="fw-bold">Số lượng</h5>
                </div>
                <hr className="border-secondary mt-2 mb-2" />

                {LoaiVes.length > 0 ? (
                  LoaiVes.map((ticket) => {
                    const cartItem = cart.find((item) => item.IDLoaiVe === ticket.IDLoaiVe);
                    const quantity = cartItem ? cartItem.SoLuong : 0;

                    return (
                      <div key={ticket.IDLoaiVe} className="pt-3 pb-3 row-default">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex flex-column align-items-start gap-1">
                            <h6 className="m-0 text fw-bold">{ticket.TenVe}</h6>
                            <p className="m-0">{ticket.GiaVe.toLocaleString()} đ</p>
                          </div>
                          {ticket.SoLuongVe > 0 && (
                            <div className="d-flex align-items-center gap-2">
                              <button className="btn btn-light pe-3 ps-3 pt-1 pb-1"
                                onClick={() => decreaseQuantity(ticket)} disabled={quantity === 0}> -
                              </button>
                              <span className="pe-3 ps-3 pt-1 pb-1 rounded-2 bg-white text-black">
                                {quantity}
                              </span>
                              <button className="btn btn-success pe-3 ps-3 pt-1 pb-1"
                                onClick={() => increaseQuantity(ticket)} disabled={quantity >= ticket.SoLuongToiDaMotDon}> +
                              </button>
                            </div>
                          )}
                          {ticket.SoLuongVe == 0 && (
                            <p className="m-0 px-2 py-1 rounded bg-pink">
                              Hết vé
                            </p>
                          )}
                          {/* {ticket.TrangThai == 'Chưa mở bán' && (
                            <p className="m-0 px-2 py-1 bg-light-orange text-warning fw-bold">
                              {ticket.TrangThai}
                            </p>
                          )} */}
                          
                        </div>
                        <div
                          className="d-flex p-2 mt-3 text-dark gap-4 align-items-center rounded"
                          style={{ backgroundColor: "rgb(235, 235, 240)" }}>
                          <i className="bi bi-exclamation-circle fs-4 ps-2"></i>
                          <div className="pt-1">{ticket.ThongTinVe}</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-muted">Không có vé nào</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div
              className="col-md-4 p-0 text-white"
              style={{ backgroundColor: "rgb(56, 56, 61)", height: "100vh", overflowY: "auto" }}>
              <div className="p-3 bg-dark">
                <div className="fs-5">{tenSuKien}</div>
              </div>
              <div className="p-3">
                <p className="d-flex gap-2 align-items-center">
                  <i className="bi bi-calendar-fill"></i>
                  <span>
                    {thoiGianBatDau && thoiGianKetThuc
                      ? `${new Date(thoiGianBatDau).toLocaleString("vi-VN")} - ${new Date(thoiGianKetThuc).toLocaleString("vi-VN")}`
                      : "Thời gian không có"}
                  </span>
                </p>
                <p className="d-flex gap-2 align-items-center">
                  <i className="bi bi-geo-alt"></i>
                  <span>{diaDiem}</span>
                </p>
                {soDoGhe ? (
                  <p className="d-flex flex-column gap-2" style={{cursor : "pointer", width : "max-content"}}  onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} >
                    <span>Ảnh sơ đồ ghế</span>
                    <img src={soDoGhe} height={100} width={100} alt=""/>
                  </p>
                ) : (
                  <div>Không có sơ đồ ghế</div>
                )}
   
              </div>
              <hr className="border-secondary" />
              {hovered && (
                <div className="over-lay w-100 bg-light">
                    <img src={soDoGhe} width={1100} height={800} style={{ zIndex: 5, padding: 4, position: "absolute", top: "100px", left: "80px", border: "2px solid #ccc", backgroundColor: "#fff" }} alt="Sơ đồ ghế"/>
                </div>
              )}            
              {/* Hiển thị danh sách vé trong cart */}
              <div className="p-3">
                <h5 className="fw-bold">Giỏ vé</h5>
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div key={item.IDLoaiVe} className="d-flex justify-content-between mb-2">
                      <span>{item.TenLoaiVe} (x{item.SoLuong})</span>
                      <span>{(item.SoLuong * item.GiaTien).toLocaleString()} đ</span>
                    </div>
                  ))
                ) : (
                  <p>Chưa có vé nào trong giỏ</p>
                )}
              </div>

              <hr className="border-secondary" />

              <p className="d-flex justify-content-between ps-3 pe-3">
                <span className="fw-bold fs-5">Tổng cộng</span>
                <span className="fw-bold fs-5">{totalAmount.toLocaleString()} đ</span>
              </p>

              <div className="position-fixed w-100 bottom-0 bg-secondary p-3 text-center text-white" style={{ maxWidth: "41rem" }}>
                <Link href={`/User/Checkout-Tickets/?id_detail=${id_detail}`}>
                  <button className="btn fs-4 btn-success text-white d-flex justify-content-center align-items-center gap-2 w-100 fw-bold"
                    onClick={createInvoice} disabled={cart.length === 0}>
                    Tiếp tục - {totalAmount.toLocaleString()} đ
                    <i className="bi bi-chevron-double-right"></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default TicketBooking;