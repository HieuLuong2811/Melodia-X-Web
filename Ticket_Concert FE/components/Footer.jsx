"use client";
import { useState } from "react";

export default function Footer() {
    return (
      <>
        {/* Bootstrap & Flag Icon CSS CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      />
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
      />
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/flag-icon-css/css/flag-icon.min.css"
      />
      <footer className="footer">
        <div className="footer-top d-flex justify-content-between">
          <div className="footer-column">
            <h5>Hotline</h5>
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-telephone-fill me-2"></i>
              <div>
                <p className="mb-0">Thứ 2 - Thứ 6 (8:30 - 18:30)</p>
                <a href="tel:19006408">1900.6408</a>
              </div>
            </div>

            <h5>Email</h5>
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-envelope-fill me-2"></i>
              <a href="mailto:support@ticketbox.vn">support@ticketbox.vn</a>
            </div>

            <h5>Văn phòng</h5>
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-geo-alt-fill me-2"></i>
              <p className="mb-0">52 Út Tịch, Phường 4, Quận Tân Bình, TP. Hồ Chí Minh</p>
            </div>
          </div>
  
          <div className="footer-column">
            <h5>Dành cho Khách hàng</h5>
            <ul>
              <li><a href="#">Điều khoản sử dụng cho khách hàng</a></li>
              <li><a href="#">Điều khoản sử dụng cho ban tổ chức</a></li>
            </ul>
  
            <h5>Đăng ký nhận email</h5>
            <form className="input-group">
              <span className="input-group-text "><i className="bi bi-envelope-fill text-success"></i></span>
              <input type="email" placeholder="Your Email" className="border-start-0" />
              <button className="input-group-text border-start-0" ><i className="bi bi-caret-right-fill text-secondary"></i></button>
            </form>

          </div>
  
          <div className="footer-column">
            <h5>Về công ty chúng tôi</h5>
            <ul>
              <li><a href="#">Quy chế hoạt động</a></li>
              <li><a href="#">Chính sách bảo mật thông tin</a></li>
              <li><a href="#">Cơ chế giải quyết tranh chấp/ khiếu nại</a></li>
              <li><a href="#">Chính sách đổi trả và kiểm hàng</a></li>
            </ul>
            <ul className="social-media d-flex">
              <li><a href="#"><i className="bi bi-facebook"></i></a></li>
              <li><a href="#"><i className="bi bi-instagram"></i></a></li>
              <li><a href="#"><i className="bi bi-tiktok"></i></a></li>
            </ul>
          </div>
        </div>
   
        <div className="footer-bottom d-flex justify-content-between align-items-center pt-3 mt-3">
          <div className="footer-app-links">
            <a href="#"><img src="/google-play.png" alt="Google Play" width={150} height={50} /></a>
            <a href="#"><img src="/app-store.png" alt="App Store" width={150} height={50} /></a>
          </div>
          <div className="footer-company-info">
            <p>Công ty TNHH Ticketbox</p>
            <p>Đại diện theo pháp luật: Trần Ngọc Thái Sơn</p>
            <p>Địa chỉ: Tầng 12, Tòa nhà Viettel, 285 Cách Mạng Tháng Tám, Quận 10, TP. Hồ Chí Minh</p>
            <p>Giấy chứng nhận đăng ký doanh nghiệp số: 0313605444</p>
          </div>
        </div>
      </footer>
      </>
    );
  };
     