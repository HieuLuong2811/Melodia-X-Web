export interface SuKien {
    IDSuKien: string;
    IDLoaiSuKien: string;
    IDNguoiDung: string;
    Logo: string;
    AnhNen: string;
    TenSuKien: string;
    DiaDiem: string;
    ThongTinSuKien: string;
    TrangThaiSuKien: "Chờ xác nhận" | "Đã xác nhận" | "Chưa bắt đầu" | "Đang diễn ra" | "Hoàn thành" | "Hủy";
    LogoBanToChuc: string; 
    TenBanToChuc: string; 
    ThongTinBanToChuc: string;
    Video : string,
  }

  export interface SuKienNormal {
    IDSuKien: string;
    TenSuKien: string;
    AnhNen: string;
    NgayDienDauTien : string;
    GiaVeReNhat : number | string;
  }

  