"use client";
import { useState, useEffect } from "react";
import "../infor-ticket/create-ticket.css";
import { LoaiVe } from "@/interfaces/LoaiVe";
import { SuatDien2 } from "@/interfaces/SuatDien";
import { VeKhuVuc } from "@/interfaces/LoaiKhuVuc";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { SuatDienService } from "@/services/SuatDien";
import { LoaiVeService } from "@/services/LoaiVe";
import ShowtimeList from "./component/showTimeList";
import TicketPopup from "./component/add-edit-ticket";

interface LoaiVeExtended extends LoaiVe {
  IDKhuVuc?: string;
  TenKhuVuc?: string;
}

const CreateTicket = () => {
  const searchParams = useSearchParams();
  const eventId = searchParams?.get("eventId");
  const isEditMode = !!eventId;

  const [showtimes, setShowtimes] = useState<SuatDien2[]>(() => {
    const savedShowtimes = sessionStorage.getItem("danhSachSuatDien");
    return savedShowtimes ? JSON.parse(savedShowtimes) : [];
  });

  const [tickets, setTickets] = useState<LoaiVeExtended[]>(() => {
    const savedTickets = sessionStorage.getItem("danhSachLoaiVe");
    return savedTickets ? JSON.parse(savedTickets) : [];
  });

  const [veKhuVucs, setVeKhuVucs] = useState<VeKhuVuc[]>(() => {
    const savedVeKhuVucs = sessionStorage.getItem("danhSachVeKhuVuc");
    return savedVeKhuVucs ? JSON.parse(savedVeKhuVucs) : [];
  });

  const [showTicketPopup, setShowTicketPopup] = useState(false);
  const [currentShowtimeId, setCurrentShowtimeId] = useState<string | null>(null);
  const [currentKhuVucId, setCurrentKhuVucId] = useState<string | null>(null);
  const [currentKhuVucName, setCurrentKhuVucName] = useState<string | null>(null);
  const [loaiVes, setLoaiVes] = useState<string | null>(null);
  const [newTicket, setNewTicket] = useState<LoaiVeExtended>({
    IDLoaiVe: "",
    TenVe: "",
    GiaVe: 0,
    SoLuongVe: 0,
    SoLuongToiDaMotDon: 0,
    AnhVe: undefined,
    ThongTinVe: "",
    IDKhuVuc: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("danhSachSuatDien", JSON.stringify(showtimes));
    sessionStorage.setItem("danhSachLoaiVe", JSON.stringify(tickets));
    sessionStorage.setItem("danhSachVeKhuVuc", JSON.stringify(veKhuVucs));
  }, [showtimes, tickets, veKhuVucs]);

  useEffect(() => {
    if (isEditMode && eventId) {
      const fetchShowtimes = async () => {
        try {
          const data = await SuatDienService.getbyIDSuKien(eventId);
          if (Array.isArray(data)) {
            setShowtimes(data);
            const allTickets = await Promise.all(
              data.map(async (showtime) => {
                const ticketlist = await LoaiVeService.getLoaiVesByIdSuatDien(showtime.IDSuatDien);
                return Array.isArray(ticketlist) ? ticketlist : [];
              })
            );
            setTickets(allTickets.flat());
          } else {
            setShowtimes([]);
            setTickets([]);
            setVeKhuVucs([]);
          }
        } catch (error) {
          console.error("Lỗi fetch showtimes:", error);
        }
      };
      fetchShowtimes();
    }
  }, [eventId, isEditMode]);

  const addShowtime = async () => {
    if (isEditMode && eventId) {
      try {
        const now = new Date();
        const defaultStart = new Date(now.getTime() + 3600000).toISOString().slice(0, 16);
        const defaultEnd = new Date(now.getTime() + 7200000).toISOString().slice(0, 16);

        const newShowtimePayload = {
          IDSuKien: eventId as string,
          ThoiGianBatDau: defaultStart,
          ThoiGianKetThuc: defaultEnd,
        };

        await SuatDienService.createSuatDiens(newShowtimePayload);
        Swal.fire({
          icon: "success",
          title: "Tạo suất diễn thành công",
          text: "Suất diễn mới đã được thêm",
          timer: 1500,
          showConfirmButton: false,
        });
        const updatedData = await SuatDienService.getbyIDSuKien(eventId);
        if (Array.isArray(updatedData)) {
          setShowtimes(updatedData);
        }
      } catch (error) {
        console.error("Lỗi tạo suất diễn:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tạo suất diễn. Vui lòng thử lại sau.",
        });
      }
    } else {
      const now = new Date();
      const defaultStart = new Date(now.getTime() + 3600000).toISOString().slice(0, 16);
      const defaultEnd = new Date(now.getTime() + 7200000).toISOString().slice(0, 16);

      const newId = `TEMP-SHOW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newShowtime = {
        IDSuatDien: newId,
        ThoiGianBatDau: defaultStart,
        ThoiGianKetThuc: defaultEnd,
      };
      setShowtimes((prev) => [...prev, newShowtime]);
    }
  };

  const handleShowtimeChange = (id: string, field: "ThoiGianBatDau" | "ThoiGianKetThuc", value: string) => {
    const currentShowtime = showtimes.find((st) => st.IDSuatDien === id);
    if (!currentShowtime) return;

    const currentDate = new Date();
    const startDate = field === "ThoiGianBatDau" ? new Date(value) : new Date(currentShowtime.ThoiGianBatDau);
    const endDate = field === "ThoiGianKetThuc" ? new Date(value) : new Date(currentShowtime.ThoiGianKetThuc);

    if (field === "ThoiGianBatDau") {
      if (value && startDate <= currentDate) {
        Swal.fire({
          icon: "warning",
          title: "Thời gian không hợp lệ",
          text: "Thời gian bắt đầu phải lớn hơn thời gian hiện tại!",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }
    }

    if (field === "ThoiGianKetThuc") {
      if (value && endDate <= new Date(currentShowtime.ThoiGianBatDau)) {
        Swal.fire({
          icon: "warning",
          title: "Thời gian không hợp lệ",
          text: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu!",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }
    }

    if (field === "ThoiGianBatDau" && currentShowtime.ThoiGianKetThuc) {
      if (value && startDate >= new Date(currentShowtime.ThoiGianKetThuc)) {
        Swal.fire({
          icon: "warning",
          title: "Thời gian không hợp lệ",
          text: "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }
    }

    setShowtimes((prev) => prev.map((st) => (st.IDSuatDien === id ? { ...st, [field]: value } : st)));
  };

  const deleteShowtime = async (showtimeId: string) => {
    if (isEditMode) {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn xoá suất diễn này?",
        text: "Thao tác này sẽ không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xoá",
        cancelButtonText: "Huỷ",
      });
      if (result.isConfirmed) {
        await SuatDienService.deleteSuatDiens(showtimeId);
        Swal.fire("Đã xoá!", "Suất diễn đã được xoá.", "success");
        const updatedData = await SuatDienService.getbyIDSuKien(eventId);
        if (Array.isArray(updatedData)) {
          setShowtimes(updatedData);
        }
      }
    } else {
      setShowtimes((prev) => prev.filter((st) => st.IDSuatDien !== showtimeId));
      setTickets((prev) => prev.filter((ticket) => ticket.IDSuatDien !== showtimeId));
      setVeKhuVucs((prev) => prev.filter((vk) => vk.IDSuatDien !== showtimeId));
    }
  };

  const deleteTicket = (ticketId: string) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa loại vé này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        setTickets((prev) => prev.filter((ticket) => ticket.IDLoaiVe !== ticketId));
        setVeKhuVucs((prev) => prev.filter((vk) => vk.IDLoaiVe !== ticketId));
        Swal.fire({
          icon: "success",
          title: "Đã xóa",
          text: "Loại vé đã được xóa thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const editTicket = (ticket: LoaiVeExtended) => {
    setNewTicket({
      IDLoaiVe: ticket.IDLoaiVe || "",
      TenVe: ticket.TenVe,
      GiaVe: ticket.GiaVe || 0,
      SoLuongVe: ticket.SoLuongVe || 0,
      SoLuongToiDaMotDon: ticket.SoLuongToiDaMotDon || 0,
      AnhVe: ticket.AnhVe,
      ThongTinVe: ticket.ThongTinVe || "",
      IDKhuVuc: ticket.IDKhuVuc || "",
    });
    setCurrentShowtimeId(ticket.IDSuatDien || "");
    setLoaiVes(ticket.IDLoaiVe ?? null);
    setIsEditing(true);
    setShowTicketPopup(true);
  };

  const openTicketPopup = (showtimeId: string, idKhuVuc: string, nameKhuVuc: string, isEditing: boolean, ticket?: LoaiVeExtended) => {
    setCurrentShowtimeId(showtimeId);
    setCurrentKhuVucId(idKhuVuc);
    setCurrentKhuVucName(nameKhuVuc);
    if (isEditing && ticket) {
      setNewTicket({
        IDLoaiVe: ticket.IDLoaiVe || "",
        TenVe: ticket.TenVe,
        GiaVe: ticket.GiaVe || 0,
        SoLuongVe: ticket.SoLuongVe || 0,
        SoLuongToiDaMotDon: ticket.SoLuongToiDaMotDon || 0,
        AnhVe: ticket.AnhVe,
        ThongTinVe: ticket.ThongTinVe || "",
        IDKhuVuc: idKhuVuc,
        TenKhuVuc: ticket.TenKhuVuc || ""
      });
      setLoaiVes(ticket.IDLoaiVe ?? null);
      setIsEditing(true);
    } else {
      setNewTicket({
        IDLoaiVe: "",
        TenVe: "",
        GiaVe: 0,
        SoLuongVe: 0,
        SoLuongToiDaMotDon: 0,
        AnhVe: undefined,
        ThongTinVe: "",
        IDKhuVuc: idKhuVuc,
      });
      setIsEditing(false);
    }
    setShowTicketPopup(true);
  };

  return (
    <div className="d-flex flex-column align-items-center gap-3">
      <ShowtimeList
        showtimes={showtimes}
        tickets={tickets}
        veKhuVucs={veKhuVucs}
        handleShowtimeChange={handleShowtimeChange}
        deleteShowtime={deleteShowtime}
        openTicketPopup={openTicketPopup}
        editTicket={editTicket}
        deleteTicket={deleteTicket}
      />
      <div className="w-100 mt-3 pt-4 d-flex justify-content-center border-top">
        <button className="form-control form d-flex gap-2 justify-content-center w-25 align-items-center" onClick={addShowtime}>
          <i className="bi bi-plus-circle-fill"></i>
          <p className="mb-0">Tạo suất diễn</p>
        </button>
      </div>
      <TicketPopup
        showTicketPopup={showTicketPopup}
        setShowTicketPopup={setShowTicketPopup}
        currentShowtimeId={currentShowtimeId}
        currentKhuVucId={currentKhuVucId}
        newTicket={newTicket}
        setNewTicket={setNewTicket}
        isEditing={isEditing}
        loaiVes={loaiVes}
        isEditMode={isEditMode}
        setTickets={setTickets}
        setVeKhuVucs={setVeKhuVucs}
        currentKhuVucName={currentKhuVucName}
      />
    </div>
  );
};

export default CreateTicket;