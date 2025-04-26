export interface HoaDonMuaVe {
    IDHoaDon: string;
    IDNguoiDung: string;
    TongSoVe: number;
    NgayThanhToan: string; 
    TongTien: number;
    PhuongThucThanhToan: 'Momo';
    chiTiet : ChiTietHoaDon[];
}

export interface ChiTietHoaDon {
    IDChiTietHoaDon: string;
    IDHoaDon: string;
    IDLoaiVe: string;
    SoLuong: number;
    GiaTien: number;
    TrangThaiVe: 'Chưa sử dụng' | 'Đã sử dụng';
}

export interface HoaDonMua {
    TenNguoiDung: string;
    Email: string;
    SoDienThoai: string;
    PhuongThucThanhToan: string;
    TongSoVeMua: number;
    TongTienThanhToan: number; 
  }
  