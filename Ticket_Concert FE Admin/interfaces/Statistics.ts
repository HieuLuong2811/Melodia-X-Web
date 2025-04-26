export interface StatsResponse {
  totalAccounts: number;
  totalEvents: number;
  totalRevenue: number;
  totalAccountsHoatDong: number;
}

export interface AccHoatDong {
  TongAccHoatDong: string; 
}

export interface RevenueStats {
  month: string;
  total: number;
}

// export interface TicketStats {
//   status: string;
//   value: number;
// }

export interface EventStats {
  type: string;
  value: number;
}

export interface RecentEvent {
  id: number;
  name: string;
  date: string;
  revenue: number;
}
