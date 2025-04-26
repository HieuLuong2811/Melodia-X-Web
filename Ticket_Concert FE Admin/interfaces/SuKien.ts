export interface SuKien {
  IDSuKien: string;
  IDLoaiSuKien: string;
  TenLoaiSuKien : string;
  IDNguoiDung: string;
  Logo: string;
  AnhNen: string;
  TenSuKien: string;
  DiaDiem: string;
  ThongTinSuKien: string;
  TrangThaiSuKien: "Tất cả" | "Chờ xác nhận" | "Đã xác nhận" | "Chưa bắt đầu" | "Đang diễn ra" | "Hoàn thành" | "Hủy";
  LogoBanToChuc: string;
  TenBanToChuc: string;
  ThongTinBanToChuc: string;
  Video : string
}

export interface LoaiVe {
  IDLoaiVe: string;
  TenVe: string;
  GiaVe: string;
  SoLuongVe : number;
}

export interface SuatDien {
  IDSuatDien: string;
  ThoiGianBatDau: string;
  ThoiGianKetThuc: string;
  loaiVes: LoaiVe[];
}

export interface SuKienDetails {
  IDSuKien: string;
  TenSuKien: string;
  AnhNen : string;
  DiaDiem: string;
  ThongTinSuKien: string;
  LogoBanToChuc : string;
  TenBanToChuc : string;
  ThongTinBanToChuc : string;
  suatDiens: SuatDien[];
}

export interface SoLuongSuKiens {
  count: number;
}
