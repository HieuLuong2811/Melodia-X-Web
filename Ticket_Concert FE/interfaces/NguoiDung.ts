export interface NguoiDung {
    IDNguoiDung: string;
    HinhAnh?: string | null;
    TenNguoiDung: string;
    Email: string;
    SoDienThoai: string;
    GioiTinh?: "Nam" | "Nữ" | "Khác" | null;
    NgaySinh?: string | null;
    MatKhau: string;
    QuyenHan: "Admin" | "Organizer" | "User";
  }
  