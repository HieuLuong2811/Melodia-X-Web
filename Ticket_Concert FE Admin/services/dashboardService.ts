import { StatsResponse, RevenueStats, EventStats, RecentEvent, AccHoatDong} from "../interfaces/Statistics";
import axiosInstance  from "../middleware/axiosConfig";

export const getDashboardStats = async (): Promise<StatsResponse> => {
  const response = await axiosInstance.get<StatsResponse>('/stats');
  return response.data;
};

export const getRevenueStats = async (): Promise<RevenueStats[]> => {
  const response = await axiosInstance.get<RevenueStats[]>(`/revenue`);
  return response.data;
};

// export const getTicketStats = async (): Promise<TicketStats[]> => {
//   const response = await axiosInstance.get<TicketStats[]>(`/tickets`);
//   return response.data;
// };

export const getEventStats = async (): Promise<EventStats[]> => {
  const response = await axiosInstance.get<EventStats[]>(`/event-types`);
  return response.data;
};

export const getRecentEvents = async (): Promise<RecentEvent[]> => {
  const response = await axiosInstance.get<RecentEvent[]>(`/recent-events`);
  return response.data;
};

export const fetchAccHoatDong = async (): Promise<AccHoatDong[]> => {
  const response = await axiosInstance.get<AccHoatDong[]>(`/AccHoatDong`);
  return response.data;
};
