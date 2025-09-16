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
    QuyenHan ENUM('Admin','User') DEFAULT 'Admin' NOT NULL,
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
	AnhSoDoGhe TEXT NULL,
    TenSuKien VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL,
    DiaDiem VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
    ThongTinSuKien TEXT NOT NULL,
    TrangThaiSuKien VARCHAR(20) DEFAULT 'Chờ xác nhận' CHECK (TrangThaiSuKien IN ('Chờ xác nhận', 'Đã xác nhận', 'Chưa bắt đầu', 'Đang diễn ra', 'Hoàn thành', 'Hủy')),
    LogoBanToChuc Text not null,
    TenBanToChuc VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL,
    ThongTinBanToChuc VARCHAR(1000) CHARACTER SET utf8mb4 NOT NULL,
    FOREIGN KEY (IDLoaiSuKien) REFERENCES LoaiSuKien(IDLoaiSuKien)
);

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
    SoLuong INT NOT NULL,
    GiaTien DECIMAL(10,2) NOT NULL,
    TrangThaiVe ENUM('Chưa sử dụng', 'Đã sử dụng') DEFAULT 'Chưa sử dụng',
    FOREIGN KEY (IDHoaDon) REFERENCES HoaDonMuaVe(IDHoaDon) on delete cascade,
    FOREIGN KEY (IDLoaiVe) REFERENCES LoaiVe(IDLoaiVe)
);

CREATE TABLE ThongBao (
    IDThongBao VARCHAR(36) PRIMARY KEY NOT NULL,
    IDNguoiDung VARCHAR(36) NOT NULL,
    TieuDe VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL, 
	NoiDung Text not null,
    NgayTao DATETIME DEFAULT NOW() NOT NULL, 
    TrangThai ENUM('Chưa đọc', 'Đã đọc') DEFAULT 'Chưa đọc',
    FOREIGN KEY (IDNguoiDung) REFERENCES NguoiDung(IDNguoiDung) ON DELETE CASCADE
);
