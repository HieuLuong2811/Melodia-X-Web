"use client";
import React, { useState, useEffect } from "react";
const CountdownTimer = dynamic(
  () => import("./CountdownTimer/CountdownTimer"),
  {
    ssr: false,
  }
);
import Swal from "sweetalert2";
const DisplayEventTime = dynamic(
  () =>
    import("@/components/DisplayEventTime").then((mod) => mod.DisplayEventTime),
  {
    ssr: false,
  }
);
import { useRouter, useSearchParams } from "next/navigation";
import "./Checkout-Tickets.css";
import { userService } from "@/services/NguoiDung";
import { NguoiDung } from "@/interfaces/NguoiDung";
import axios from "axios";
import dynamic from "next/dynamic";

interface CartItem {
  idLoaiVe: string;
  tenLoaiVe: string;
  soLuong: number;
  giaTien: number;
}

const Checkout = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const id_detail = searchParams.get("id_detail");

  const [AnhNen, setAnhNen] = useState<string | null>(null);
  const [tenSuKien, setTenSuKien] = useState("");
  const [diaDiem, setDiaDiem] = useState("");
  const [thoiGianBatDau, setThoiGianBatDau] = useState("");
  const [thoiGianKetThuc, setThoiGianKetThuc] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [user, setuser] = useState<NguoiDung | null>(null);

  useEffect(() => {
    const iduser = localStorage.getItem("IDNguoiDung");
    if (iduser) {
      const fecthuser = async () => {
        const data = await userService.getUserById(iduser);
        setuser(data);
      };
      fecthuser();
    }
  }, []);

  const [cart, setCart] = useState<{
    chiTiet: CartItem[];
    tongTien: number;
    tongSoLuong: number;
  }>({
    chiTiet: [],
    tongTien: 0,
    tongSoLuong: 0,
  });

  useEffect(() => {
    const storedAnhNen = localStorage.getItem("AnhNen");
    setAnhNen(storedAnhNen);

    const savedCart = sessionStorage.getItem("invoice");
    if (!savedCart) {
      router.push("/");
      return;
    }

    const parsedCart = JSON.parse(savedCart);
    if (!parsedCart.chiTiet || parsedCart.chiTiet.length === 0) {
      router.push("/");
      return;
    }
    setCart(parsedCart);

    const suatdiens = sessionStorage.getItem("suatInfo");
    if (suatdiens) {
      const suatdien = JSON.parse(suatdiens);
      setTenSuKien(suatdien.TenSuKien);
      setDiaDiem(suatdien.DiaDiem);
      setThoiGianBatDau(suatdien.ThoiGianBatDau);
      setThoiGianKetThuc(suatdien.ThoiGianKetThuc);
      setAnhNen(suatdien.AnhNen);
    }
  }, []);

  const handleTimeout = () => {
    sessionStorage.removeItem("invoice");
    sessionStorage.removeItem("countdownTime");

    setTimeout(() => {
      router.push("/");
    }, 0);
  };

  const handleTabClick = () => {
    Swal.fire({
      title: "Huỷ đơn hàng",
      text: "Bạn có chắc chắn sẽ huỷ đơn hàng này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Không",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("countdownTime");
        router.push(`/User/Book-Tickets/?id_detail=${id_detail}`);
      } else {
      }
    });
  };

  const handleout = () => {
    Swal.fire({
      title: "Huỷ đơn hàng",
      text: "Bạn có chắc chắn sẽ huỷ đơn hàng này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Không",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("cart");
        sessionStorage.removeItem("countdownTime");
        sessionStorage.removeItem("timeLeft");
        router.push("/");
      }
    });
  };

  const handleCreateOrder = async () => {
    setIsLoading(true);
    try {
      const cart = JSON.parse(sessionStorage.getItem("invoice") || "[]");

      const createOrderRes = await axios.post(
        "http://localhost:3000/api/HoaDons",
        cart,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (createOrderRes.status === 201) {
        const hoaDon = createOrderRes.data;
        sessionStorage.setItem("invoice", JSON.stringify(hoaDon));

        const momoRes = await axios.post("http://localhost:3000/api/momo", {
          orderId: hoaDon.idHoaDon,
          amount: hoaDon.tongTien,
          orderInfo: "Thanh toán vé sự kiện",
          redirectUrl: "http://localhost:3005/User/My-Infor/",
          ipnUrl: "http://localhost:3000/api/payment/momo-ipn",
        });

        if (momoRes.status === 200 && momoRes.data.payUrl) {
          window.location.href = momoRes.data.payUrl;
          try {
            await fetch("http://localhost:3000/api/pay-ticket-pass", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user?.Email || "",
                tenNguoiDung: user?.TenNguoiDung || "",
                maHoaDon: hoaDon.idHoaDon,
                tenSuKien: tenSuKien,
                ticketDetails: cart.chiTiet.map((item: CartItem) => ({
                  maVe: item.idLoaiVe,
                  tenVe: item.tenLoaiVe,
                  soLuong: item.soLuong,
                  giaTien: item.giaTien,
                })),
                totalAmount: hoaDon.tongTien,
                startDate: thoiGianBatDau
                  ? new Date(thoiGianBatDau).toISOString()
                  : "",
                endDate: thoiGianKetThuc
                  ? new Date(thoiGianKetThuc).toISOString()
                  : "",
              }),
            });
          } catch (error) {
            Swal.fire(
              "Lỗi!",
              `Có lỗi xảy ra khi gửi emails + ${error}`,
              "error"
            );
          }
        } else {
          await axios.delete(
            `http://localhost:3000/api/HoaDons/${hoaDon.idHoaDon}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Lỗi khi tạo đơn hàng. Vui lòng thử lại.",
          });
          window.location.href = "/User/Book-Tickets/?id_detail=" + id_detail;
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi" + error,
        text: "Lỗi khi tạo đơn hàng. Vui lòng thử lại.",
      });

      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-black" style={{ zoom: "0.9", height: "100%" }}>
        <nav className="navbar navbar-expand-lg navbar-light pt-3 pb-3 position-sticky top-0 z-3">
          <div className="container justify-content-center">
            <div onClick={handleout}>
              <img src="/logo_User.png" style={{ height: "60px" }} alt="Logo" />
            </div>
          </div>
        </nav>
        <div
          className="w-100 d-flex justify-content-center align-items-center bg-secondary gap-3 pt-1 pb-1"
          style={{ cursor: "pointer" }}
        >
          <div
            onClick={() => handleTabClick()}
            className="d-flex flex-column align-items-center"
          >
            <i className="bi bi-check-circle-fill text-white"></i>
            <span className="text-white">Chọn vé</span>
          </div>
          <p className="mb-0 text-white"> —</p>
          <div className="d-flex flex-column align-items-center">
            <i className="bi bi-circle text-warning"></i>
            <span className="text-warning">Bảng câu hỏi</span>
          </div>
          <p className="mb-0 text-white"> —</p>
          <div className="d-flex flex-column align-items-center">
            <i className="bi bi-circle text-dark-gray"></i>
            <span className="text-dark-gray">Thanh toán</span>
          </div>
        </div>

        <div className="background-container">
          {AnhNen && (
            <img src={AnhNen} className="background-img" alt="Background" />
          )}
          <div className="container d-flex align-items-center justify-content-between p-0">
            <div className="text-white col-md-10 p-4">
              <h3 className="m-0 fw-bold pt-2 pb-4 border-bottom">
                {tenSuKien}
              </h3>
              <div className="pt-3">
                <p className="mb-1 fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-geo-alt-fill"></i>
                  {diaDiem}
                </p>
                <p className="d-flex align-items-center fw-bold gap-2">
                  <i className="bi bi-calendar-fill"></i>
                  <DisplayEventTime
                    start={thoiGianBatDau}
                    end={thoiGianKetThuc}
                  />
                </p>
              </div>
            </div>
            <div className="text-white col-md-2">
              <CountdownTimer onTimeout={handleTimeout} />
            </div>
          </div>
        </div>

        <div className="bg-black">
          <div className="container p-0 pt-4 pb-4">
            <span className="fs-4 text-white">Thông tin nhận vé</span>
          </div>
          <div className="container p-0 d-flex justify-content-between gap-3">
            <div className="col-md-8">
              <div className="bg-secondary text-white rounded">
                <div className="p-4 d-flex justify-content-between">
                  <h4 className="mb-0 fw-bold">Thông tin khách hàng</h4>
                  <span className="fs-5" style={{ cursor: "pointer" }}>
                    Sửa thông tin
                  </span>
                </div>
                <div
                  className="px-4 pt-2 pb-3"
                  style={{ backgroundColor: "rgb(56,56,61)", fontSize: "18px" }}
                >
                  <label className="mt-2 fw-bold text-white">
                    Tôi đồng ý cho Melodia-X & BTC sử dụng thông tin đặt vé nhằm
                    mục đích vận hành sự kiện
                  </label>
                  <div className="form-check pt-2 pb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="agree"
                      id="agree"
                    />
                    <span className="form-check-label">Tôi đồng ý</span>
                  </div>
                  <div className="form-check p-0 pb-2">
                    <label className="mt-2 mb-2 text-white">
                      Họ tên người nhận :{" "}
                    </label>
                    <span className="p-2">
                      {(user && user?.TenNguoiDung) || ""}
                    </span>
                  </div>
                  <div className="form-check col-md-4 p-0 pb-2">
                    <label className="mt-2 mb-2 text-white">
                      Số điện thoại :{" "}
                    </label>
                    <span className="p-2">
                      {(user && user?.SoDienThoai) || ""}
                    </span>
                  </div>
                  <div className="form-check col-md-4 p-0 pb-2">
                    <label className="mt-2 mb-2 text-white">Email : </label>
                    <span className="p-2">{(user && user?.Email) || ""}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card col-md-4 p-3">
              <div className="container align-items-center d-flex justify-content-between border-bottom p-0 pb-4">
                <span className="fs-4 text">Thông tin đặt vé</span>
                <button
                  onClick={() => handleTabClick()}
                  className="text-primary float-end border-none bg-transparent"
                >
                  Chọn lại vé
                </button>
              </div>
              <div className="pb-2 mt-2">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold">Loại vé</h5>
                  <h5 className="fw-bold">Số lượng</h5>
                </div>
              </div>

              {cart && cart.chiTiet && cart.chiTiet.length > 0 ? (
                cart.chiTiet.map((item, index) => (
                  <div
                    key={`${item.idLoaiVe}-${index}`}
                    className="border-bottom pb-2 pt-2"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{item.tenLoaiVe}</span>
                      <span className="text-secondary">{item.soLuong}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-secondary">
                        {item.giaTien && !isNaN(Number(item.giaTien))
                          ? Number(item.giaTien).toLocaleString()
                          : "N/A"}{" "}
                        đ
                      </span>
                      <span className="text-secondary">
                        {(item.soLuong * item.giaTien).toLocaleString()} đ
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p>Chưa có vé nào trong giỏ</p>
              )}

              <div className="d-flex justify-content-between pt-2">
                <strong className="fs-5">Tạm tính {cart.tongSoLuong} vé</strong>
                <strong className="text fs-5">
                  {cart.tongTien.toLocaleString()} đ
                </strong>
              </div>
              <div className="text-center mt-4">
                <span className="text-secondary">
                  Vui lòng trả lời tất cả các câu hỏi để tiếp tục
                </span>
                <button
                  className="btn btn-success mt-2 w-100"
                  onClick={() => handleCreateOrder()}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Tiếp tục »"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
