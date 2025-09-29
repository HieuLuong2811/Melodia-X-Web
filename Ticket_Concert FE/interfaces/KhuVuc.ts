export interface KhuVuc {
  IDKhuVuc: string;
  TenKhuVuc: string;
  LoaiKhuVuc: 
    | 'VIP1' | 'VIP2' | 'VIP3' | 'VIP4' | 'VIP5'
    | 'A1' | 'A2' | 'A3' | 'A4'
    | 'B1' | 'B2' | 'B3' | 'B4'
    | 'C1' | 'C2'
    | 'D1' | 'D2'
    | 'E1' | 'E2' | 'E3';
  LuongVeToiDa: number;
}
