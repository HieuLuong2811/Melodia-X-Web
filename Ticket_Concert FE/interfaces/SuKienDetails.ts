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