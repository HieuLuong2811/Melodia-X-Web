USE QuanLySuKien;

-- Bảng người dùng 
CREATE TABLE NguoiDung (
    IDNguoiDung VARCHAR(36) PRIMARY KEY not null,
    HinhAnh TEXT NULL,
    TenNguoiDung VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
    Email VARCHAR(50) NOT NULL UNIQUE,
    SoDienThoai VARCHAR(15) NOT NULL UNIQUE,
    GioiTinh ENUM('Nam', 'Nữ', 'Khác') NULL,
    NgaySinh DATE NULL,
    MatKhau VARCHAR(255) NOT NULL, 
    QuyenHan ENUM('Admin','User') DEFAULT 'User' NOT NULL,
	TrangThai ENUM('Hoạt động', 'Khoá') DEFAULT 'Hoạt động' NOT NULL
);

CREATE TABLE ThongTinThanhToan (
	IDThongTin VARCHAR(36) PRIMARY KEY not null,
    IDNguoiDung VARCHAR(36) not null,
    ChuTaiKhoan VARCHAR(50) CHARACTER SET utf8mb4 not Null,
    SoTaiKhoan Varchar(50) not null,
    TenNganHang VARCHAR(50) CHARACTER SET utf8mb4 not null,
    ChiNhanh VARCHAR(50) CHARACTER SET utf8mb4 not null,
    LoaiHinh VARCHAR(50) CHARACTER SET utf8mb4 not null,
    FOREIGN KEY (IDNguoiDung) REFERENCES NguoiDung(IDNguoiDung)
);

-- Bảng Loại sự kiện
CREATE TABLE LoaiSuKien (
    IDLoaiSuKien VARCHAR(36) PRIMARY KEY NOT NULL,
    TenLoai VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL
);

-- Bảng Sự kiện
CREATE TABLE SuKien (
    IDSuKien VARCHAR(36) PRIMARY KEY NOT NULL,
    IDLoaiSuKien VARCHAR(36) NOT NULL,
    IDNguoiDung VARCHAR(36) NOT NULL,
    Logo TEXT NOT NULL,
    AnhNen Text NOT Null,
    Video TEXT NULL,
    TenSuKien VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL,
    DiaDiem VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
    ThongTinSuKien TEXT NOT NULL,
    TrangThaiSuKien VARCHAR(20) DEFAULT 'Chờ xác nhận' CHECK (TrangThaiSuKien IN ('Chờ xác nhận', 'Đã xác nhận', 'Chưa bắt đầu', 'Đang diễn ra', 'Hoàn thành', 'Hủy')),
    LogoBanToChuc Text not null,
    TenBanToChuc VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL,
    ThongTinBanToChuc VARCHAR(1000) CHARACTER SET utf8mb4 NOT NULL,
    FOREIGN KEY (IDLoaiSuKien) REFERENCES LoaiSuKien(IDLoaiSuKien)
);

select * from SuKien ;
update SuKien set TrangThaiSuKien = 'Chờ xác nhận' where IDSuKien = '4bfaf293-61a8-490e-9e07-00631b8121e9';

CREATE TABLE ThanhVien (
	IDThanhVien VARCHAR(36) PRIMARY KEY NOT NULL,
    IDSuKien VARCHAR(36) NOT NULL,
    TenThanhVien VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
    Email VARCHAR(50) NOT NULL UNIQUE,
    VaiTro VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
	FOREIGN KEY (IDSuKien) REFERENCES SuKien(IDSuKien)
);

CREATE TABLE SuatDien (
	IDSuatDien VARCHAR(36) PRIMARY KEY NOT NULL,
    IDSuKien VARCHAR(36) NOT NULL,
    ThoiGianBatDau datetime NOT NULL, 
    ThoiGianKetThuc datetime NOT NULL,
	FOREIGN KEY (IDSuKien) REFERENCES SuKien(IDSuKien)
);


CREATE TABLE KhuVuc (
    IDKhuVuc VARCHAR(36) PRIMARY KEY NOT NULL,
    TenKhuVuc VARCHAR(50) NOT NULL,               
    LoaiKhuVuc ENUM('VIP1', 'VIP2','VIP3','VIP4','VIP5','A1','A2','A3','A4','B1','B2','B3','B4','C1','C2','D1','D2','E1','E2','E3') DEFAULT 'E1',
    LuongVeToiDa int not null
);
-- Bảng Vé
CREATE TABLE LoaiVe (
    IDLoaiVe VARCHAR(36) PRIMARY KEY,
    IDSuatDien VARCHAR(36) NOT NULL,
    TenVe VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
    AnhVe TEXT NULL,
    GiaVe DECIMAL(10,2) NOT NULL,
    SoLuongVe INT NOT NULL,	
    SoLuongToiDaMotDon INT NULL,
    ThongTinVe TEXT CHARACTER SET utf8mb4 NULL,
    FOREIGN KEY (IDSuatDien) REFERENCES SuatDien(IDSuatDien) ON DELETE CASCADE
);

CREATE TABLE VeKhuVuc (
    IDVeGhe VARCHAR(36) PRIMARY KEY NOT NULL,
    IDLoaiVe VARCHAR(36) NOT NULL,
    IDKhuVuc VARCHAR(36) NOT NULL,
    IDSuatDien VARCHAR(36) NOT NULL,
    IDSuKien VARCHAR(36) NOT NULL,
    FOREIGN KEY (IDLoaiVe) REFERENCES LoaiVe(IDLoaiVe),
    FOREIGN KEY (IDKhuVuc) REFERENCES KhuVuc(IDKhuVuc),
    FOREIGN KEY (IDSuatDien) REFERENCES SuatDien(IDSuatDien),
    FOREIGN KEY (IDSuKien) REFERENCES SuKien(IDSuKien)
);

SELECT LV.IDLoaiVe, LV.TenVe, LV.GiaVe, LV.SoLuongVe, LV.SoLuongToiDaMotDon, LV.ThongTinVe, KV.TenKhuVuc, KV.LuongVeToiDa 
FROM LoaiVe lV inner join VeKhuVuc VKV on LV.IDLoaiVe = VKV.IDLoaiVe inner join KhuVuc KV on VKV.IDKhuVuc = KV.IDKhuVuc where LV.IDSuatDien = '31b60d42-eabe-4f50-aaeb-c5334cbfe039' and KV.IDKhuVuc = '1a2b3c4d-0002-0000-0000-000000000002';

-- Bảng hoá đơn
CREATE TABLE HoaDonMuaVe (
    IDHoaDon VARCHAR(36) PRIMARY KEY NOT NULL,
    IDNguoiDung VARCHAR(36) NOT NULL,
    TongSoVe INT NOT NULL,
    NgayThanhToan DATETIME DEFAULT NOW() NOT NULL,
    TongTien DECIMAL(10,2) NOT NULL,
    PhuongThucThanhToan ENUM('Thẻ', 'Chuyển khoản', 'Momo', 'VNPay') NOT NULL,
    TrangThaiThanhToan ENUM('Chưa thanh toán', 'Đã thanh toán') DEFAULT 'Chưa thanh toán' NOT NULL,
    FOREIGN KEY (IDNguoiDung) REFERENCES NguoiDung(IDNguoiDung)
);

-- Bảng Chi tiết hoá đơn
CREATE TABLE ChiTietHoaDon (
    IDChiTietHoaDon VARCHAR(36) PRIMARY KEY NOT NULL,
    IDHoaDon VARCHAR(36) NOT NULL,
    IDLoaiVe VARCHAR(36) NOT NULL,
    TenKhuVuc VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
    SoLuong INT NOT NULL,
    GiaTien DECIMAL(10,2) NOT NULL,
    TrangThaiVe ENUM('Chưa sử dụng', 'Đã sử dụng') DEFAULT 'Chưa sử dụng',
    FOREIGN KEY (IDHoaDon) REFERENCES HoaDonMuaVe(IDHoaDon) on delete cascade,
    FOREIGN KEY (IDLoaiVe) REFERENCES LoaiVe(IDLoaiVe)
);

select * from LoaiVe where IDLoaiVe = '12d6b7cd-b275-48da-a97c-5a9fb363e2a8';
select * from SuatDien where IDSuatDien = '31b60d42-eabe-4f50-aaeb-c5334cbfe039';
select * from SuKien where IDSuKien = '9a6cc8f4-7bfb-4f98-a53b-e858163a303e';
CREATE TABLE ThongBao (
    IDThongBao VARCHAR(36) PRIMARY KEY NOT NULL,
    IDNguoiDung VARCHAR(36) NOT NULL,
    TieuDe VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL, 
	NoiDung Text not null,
    NgayTao DATETIME DEFAULT NOW() NOT NULL, 
    TrangThai ENUM('Chưa đọc', 'Đã đọc') DEFAULT 'Chưa đọc',
    FOREIGN KEY (IDNguoiDung) REFERENCES NguoiDung(IDNguoiDung) ON DELETE CASCADE
);
select * from ThongBao where IDNguoiDung = '3671ca1e-0445-4aac-968f-9fb45cd86149';
-- Xóa bảng con trước
DROP TABLE IF EXISTS VeKhuVuc;
DROP TABLE IF EXISTS ChiTietHoaDon;
DROP TABLE IF EXISTS ThongBao;
DROP TABLE IF EXISTS HoaDonMuaVe;
DROP TABLE IF EXISTS LoaiVe;
DROP TABLE IF EXISTS SuatDien;
DROP TABLE IF EXISTS ThanhVien;
DROP TABLE IF EXISTS SuKien;
DROP TABLE IF EXISTS ThongTinThanhToan;

-- Xóa bảng cha
DROP TABLE IF EXISTS KhuVuc;
DROP TABLE IF EXISTS LoaiSuKien;
DROP TABLE IF EXISTS NguoiDung;

INSERT INTO KhuVuc (IDKhuVuc, TenKhuVuc, LoaiKhuVuc, LuongVeToiDa) VALUES
('1a2b3c4d-0001-0000-0000-000000000001', 'Khu VIP 1', 'VIP1', 50),
('1a2b3c4d-0002-0000-0000-000000000002', 'Khu VIP 2', 'VIP2', 50),
('1a2b3c4d-0003-0000-0000-000000000003', 'Khu VIP 3', 'VIP3', 50),
('1a2b3c4d-0004-0000-0000-000000000004', 'Khu VIP 4', 'VIP4', 50),
('1a2b3c4d-0005-0000-0000-000000000005', 'Khu VIP 5', 'VIP5', 50),
('1a2b3c4d-0011-0000-0000-000000000011', 'Khu A1', 'A1', 100),
('1a2b3c4d-0012-0000-0000-000000000012', 'Khu A2', 'A2', 100),
('1a2b3c4d-0013-0000-0000-000000000013', 'Khu A3', 'A3', 100),
('1a2b3c4d-0014-0000-0000-000000000014', 'Khu A4', 'A4', 100),
('1a2b3c4d-0021-0000-0000-000000000021', 'Khu B1', 'B1', 80),
('1a2b3c4d-0022-0000-0000-000000000022', 'Khu B2', 'B2', 80),
('1a2b3c4d-0023-0000-0000-000000000023', 'Khu B3', 'B3', 100),
('1a2b3c4d-0024-0000-0000-000000000024', 'Khu B4', 'B4', 100),
('1a2b3c4d-0031-0000-0000-000000000031', 'Khu C1', 'C1', 120),
('1a2b3c4d-0032-0000-0000-000000000032', 'Khu C2', 'C2', 120),
('1a2b3c4d-0041-0000-0000-000000000041', 'Khu D1', 'D1', 150),
('1a2b3c4d-0042-0000-0000-000000000042', 'Khu D2', 'D2', 150),
('1a2b3c4d-0051-0000-0000-000000000051', 'Khu E1', 'E1', 200),
('1a2b3c4d-0052-0000-0000-000000000052', 'Khu E2', 'E2', 200),
('1a2b3c4d-0053-0000-0000-000000000053', 'Khu E3', 'E3', 200);