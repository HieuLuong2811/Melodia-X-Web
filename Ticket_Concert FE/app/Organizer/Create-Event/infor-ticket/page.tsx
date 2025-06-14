"use client";
import { useState, useEffect } from "react";
import "../infor-ticket/create-ticket.css";
import { NumberFormatValues } from "react-number-format";
import { useCollapse } from "react-collapsed";
import { NumericFormat } from "react-number-format";
import { LoaiVe } from "@/interfaces/LoaiVe";
import { SuatDien2 } from "@/interfaces/SuatDien";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import DisplayEventTime from "@/components/DisplayEventTime";
import {SuatDienService} from "@/services/SuatDien.ts"
import { LoaiVeService } from "@/services/LoaiVe";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Component con cho mỗi suất diễn
const ShowtimeItem = ({
  showtime,
  tickets,
  handleShowtimeChange,
  deleteShowtime,
  openTicketPopup,
  editTicket,
  deleteTicket,
}: {
  showtime: SuatDien2;
  tickets: LoaiVe[];
  handleShowtimeChange: (id: string, field: "ThoiGianBatDau" | "ThoiGianKetThuc", value: string) => void;
  deleteShowtime: (showtimeId: string) => void;
  openTicketPopup: (showtimeId: string) => void;
  editTicket: (ticket: LoaiVe) => void;
  deleteTicket: (ticketId: string) => void;
}) => {
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  const handleToggleCollapse = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div key={showtime.IDSuatDien} className="SuatDien w-100">
      <div
        {...getToggleProps({ onClick: handleToggleCollapse })}
        className="ticket rounded justify-content-between w-100 d-flex text-black p-2 ps-3 pe-3 align-items-center gap-3">
        <div className="icon">
          <i className={`bi ${isExpanded ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
        </div>
        <div className="w-100">
          <div className="d-flex align-items-center fw-bold gap-2">
            <DisplayEventTime start={showtime.ThoiGianBatDau || "Chưa chọn"} end={showtime.ThoiGianKetThuc || "Chưa chọn"}/>
          </div>
          <p className="mb-0">{tickets.filter((t) => t.IDSuatDien === showtime.IDSuatDien).length} loại vé</p>
        </div>
        <span className="fs-4">⋮</span>
      </div>
      <section {...getCollapseProps()} className="w-100 mt-2">
        <div className="ticket-time d-flex rounded-1 flex-column p-2 ps-3 pb-4 pe-3 gap-3 w-100">
          <div onClick={() => handleToggleCollapse()} className="text-white justify-content-between w-100 d-flex align-items-center gap-3">
            <div className="icon">
              <i className="bi bi-chevron-up"></i>
            </div>
            <div className="w-100">
              <p className="mb-0">Ngày sự kiện</p>
            </div>
            <span onClick={() => deleteShowtime(showtime.IDSuatDien)}>❌</span>
          </div>
          <div className="d-flex mt-3 justify-content-betwee gap-5">
            <div className="w-50">
              <label className="mb-2 border-0">Thời gian bắt đầu</label>
              <input type="datetime-local" className="form-control datetime" value={showtime.ThoiGianBatDau}
                onChange={(e) => handleShowtimeChange(showtime.IDSuatDien, "ThoiGianBatDau", e.target.value)}/>
            </div>
            <div className="w-50">
              <label className="mb-2 border-0">Thời gian kết thúc</label>
              <input type="datetime-local" className="form-control datetime" value={showtime.ThoiGianKetThuc}
                onChange={(e) => handleShowtimeChange(showtime.IDSuatDien, "ThoiGianKetThuc", e.target.value)}/>
            </div>
          </div>
          <div className="d-flex flex-column">
            <label className="mb-2 border-0">Loại vé</label>
            <button className="w-25 form-control form d-flex gap-2 align-items-center"
              onClick={() => openTicketPopup(showtime.IDSuatDien)}>
              <i className="bi bi-plus-circle-fill"></i>
              <p className="mb-0">Tạo loại vé mới</p>
            </button>
          </div>
          {tickets
            .filter((ticket) => ticket.IDSuatDien === showtime.IDSuatDien)
            .map((ticket) => (
              <div key={ticket.IDLoaiVe} className="ticket-item mt-2 d-flex justify-content-between align-items-center w-100 px-3 py-2 rounded"
                style={{ background: "rgb(65, 70, 82)", border: "1px solid rgb(56, 56, 61)" }}>
                <div className="d-flex align-items-center gap-2 flex-wrap text-white">
                  <i className="bi bi-list mt-1"></i>
                  <i className="bi bi-ticket-perforated mt-1"></i>
                  <span>
                    <strong>Vé {ticket.TenVe}</strong>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-pencil-square text-black bg-white p-2 pb-1 rounded"
                    style={{ cursor: "pointer" }} title="Chỉnh sửa" onClick={() => editTicket(ticket)}>
                  </i>
                  <i
                    className="bi bi-trash text-white bg-danger p-2 pb-1 rounded"
                    style={{ cursor: "pointer" }}
                    title="Xóa"
                    onClick={() => deleteTicket(ticket.IDLoaiVe || "")}
                  ></i>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};


// Component chính
const Create_ticket = () => {

  const searchParams = useSearchParams();
  const eventId = searchParams?.get("eventId");
  const isEditMode = !!eventId;

    const [showtimes, setShowtimes] = useState<SuatDien2[]>(() => {
    if (!isEditMode) {
      sessionStorage.removeItem("danhSachSuatDien");
      return [];
    }
    const savedShowtimes = sessionStorage.getItem("danhSachSuatDien");
    return savedShowtimes ? JSON.parse(savedShowtimes) : [];
  });

  const [tickets, setTickets] = useState<LoaiVe[]>(() => {
    if (!isEditMode) {
      sessionStorage.removeItem("danhSachLoaiVe");
      return [];
    }
    const savedTickets = sessionStorage.getItem("danhSachLoaiVe");
    return savedTickets ? JSON.parse(savedTickets) : [];
  });

  useEffect(() => {
  sessionStorage.setItem("danhSachSuatDien", JSON.stringify(showtimes));
  sessionStorage.setItem("danhSachLoaiVe", JSON.stringify(tickets));
  if (isEditMode) {
    const fetchShowtimes = async () => {
      const data = await SuatDienService.getbyIDSuKien(eventId);
      if (Array.isArray(data)) {
        setShowtimes(data);

        const allTickets = await Promise.all(
          data.map(async (showtimes) => {
            const ticketlist = await LoaiVeService.getLoaiVesByIdSuatDien(showtimes.IDSuatDien);
            return Array.isArray(ticketlist) ? ticketlist : [];
          })
        );
        const merged = allTickets.flat();
        setTickets(merged);
      }
      else {
        setShowtimes([]);
        setTickets([]);
        sessionStorage.removeItem("danhSachSuatDien");
        sessionStorage.removeItem("danhSachLoaiVe");
      }
    };
    fetchShowtimes();
  }
}, [eventId,isEditMode, showtimes, tickets])
  

  const [showTicketPopup, setShowTicketPopup] = useState(false);
  const [currentShowtimeId, setCurrentShowtimeId] = useState<string | null>(null);
  const [loaiVes, setLoaiVes] = useState<string | null>(null);
  const [newTicket, setNewTicket] = useState({
    IDLoaiVe: "",
    TenVe: "",
    GiaVe: undefined as number | undefined,
    SoLuongVe: "",
    SoLuongToiDaMotDon: "",
    AnhVe: null as string | null,
    ThongTinVe: "",
  });
  const [isEditing, setIsEditing] = useState(false);


  // Tạo suất diễn
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


  // Select thời gian
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

  // Xoá suất diễn
  const deleteShowtime = async (showtimeId: string) => {
    if(isEditMode){
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
      }
    } 
    else {
      setShowtimes((prev) => prev.filter((st) => st.IDSuatDien !== showtimeId));
      setTickets((prev) => prev.filter((ticket) => ticket.IDSuatDien !== showtimeId));
    }
  };

  // Xoá vé
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


  // Mở popup để sửa vé
  const editTicket = (ticket: LoaiVe) => {
    setNewTicket({
      IDLoaiVe: ticket.IDLoaiVe || "",
      TenVe: ticket.TenVe,
      GiaVe: ticket.GiaVe,
      SoLuongVe: ticket.SoLuongVe.toString(),
      SoLuongToiDaMotDon : ticket.SoLuongToiDaMotDon.toString(),
      AnhVe: ticket.AnhVe,
      ThongTinVe: ticket.ThongTinVe,
    });
    setCurrentShowtimeId(ticket.IDSuatDien);
    setLoaiVes(ticket.IDLoaiVe ?? null);
    setIsEditing(true);
    setShowTicketPopup(true);
  };

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (values: NumberFormatValues) => {
    const { floatValue } = values;
    setNewTicket((prev) => ({ ...prev, GiaVe: floatValue }));
  };

  // Thêm và sửa vé
  const saveTicket = async () => {
    if (!newTicket.TenVe || !newTicket.GiaVe || !newTicket.SoLuongVe) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập đầy đủ thông tin",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    if (isEditing) {
      if(isEditMode){
        const newLoaive = {
          IDSuatDien: currentShowtimeId as string,
          TenVe: newTicket.TenVe,
          GiaVe: newTicket.GiaVe!,
          SoLuongVe: parseInt(newTicket.SoLuongVe),
          SoLuongToiDaMotDon : parseInt(newTicket.SoLuongToiDaMotDon),
          AnhVe: newTicket.AnhVe || "",
          ThongTinVe: newTicket.ThongTinVe,
        };

        const createdLoaiVe = await LoaiVeService.updateLoaiVe(loaiVes!, newLoaive);
        setTickets((prev) => [...prev, createdLoaiVe]);
        Swal.fire({
          icon: "success",
          title: "Sửa thông tin loại vé thành công",
          text: "Loại vé đã được sửa",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      else {
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket.IDLoaiVe === newTicket.IDLoaiVe
              ? {
                  ...ticket,
                  TenVe: newTicket.TenVe,
                  GiaVe: newTicket.GiaVe!,
                  SoLuongVe: parseInt(newTicket.SoLuongVe),
                  SoLuongToiDaMotDon: parseInt(newTicket.SoLuongToiDaMotDon),
                  AnhVe: newTicket.AnhVe || "",
                  ThongTinVe: newTicket.ThongTinVe,
                }
              : ticket
          )
        );
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công",
          text: "Thông tin loại vé được sửa thành công",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } else {
      if(isEditMode) {
         const newLoaive = {
          IDSuatDien: currentShowtimeId as string,
          TenVe: newTicket.TenVe,
          GiaVe: newTicket.GiaVe!,
          SoLuongVe: parseInt(newTicket.SoLuongVe),
          SoLuongToiDaMotDon : parseInt(newTicket.SoLuongToiDaMotDon),
          AnhVe: newTicket.AnhVe || "",
          ThongTinVe: newTicket.ThongTinVe || "",
        };

        const create =  await LoaiVeService.createLoaiVe(newLoaive);
        setTickets((prev) => [...prev, create]);
        Swal.fire({
          icon: "success",
          title: "Tạo loại vé thành công",
          text: "Loại vé mới đã được thêm",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      else {
        const newTicketData: LoaiVe = {
          IDLoaiVe: `TEMP-TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          IDSuatDien: currentShowtimeId || "",
          TenVe: newTicket.TenVe,
          AnhVe: newTicket.AnhVe || "",
          GiaVe: newTicket.GiaVe,
          SoLuongVe: parseInt(newTicket.SoLuongVe),
          SoLuongToiDaMotDon : parseInt(newTicket.SoLuongToiDaMotDon),
          ThongTinVe: newTicket.ThongTinVe || ""
        };
        setTickets((prev) => [...prev, newTicketData]);
        Swal.fire({
          icon: "success",
          title: "Tạo thành công",
          text: "Tạo loại vé thành công",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    }
    setNewTicket({ IDLoaiVe: "", TenVe: "", GiaVe: undefined, SoLuongVe: "", SoLuongToiDaMotDon: "", AnhVe: null, ThongTinVe: "" });
    setShowTicketPopup(false);
    setIsEditing(false);
  };

  const openTicketPopup = (showtimeId: string) => {
    setCurrentShowtimeId(showtimeId);
    setNewTicket({ IDLoaiVe: "", TenVe: "", GiaVe: undefined, SoLuongVe: "", SoLuongToiDaMotDon: "", AnhVe: null, ThongTinVe: "" });
    setIsEditing(false);
    setShowTicketPopup(true);
  };

  return (
    <div className="d-flex flex-column align-items-center gap-3">
      {/* Hiển thị danh sách suất diễn */}
      {Array.isArray(showtimes) && showtimes.map((showtime, index) => (
        <ShowtimeItem
          key={showtime.IDSuatDien || `showtime-${index}`}
          showtime={showtime}
          tickets={tickets}
          handleShowtimeChange={handleShowtimeChange}
          deleteShowtime={deleteShowtime}
          openTicketPopup={openTicketPopup}
          editTicket={editTicket}
          deleteTicket={deleteTicket}
        />
      ))}

      {/* Nút tạo suất diễn */}
      <div className="w-100 mt-3 pt-4 d-flex justify-content-center border-top">
        <button className="form-control form d-flex gap-2 justify-content-center w-25 align-items-center" onClick={addShowtime}>
          <i className="bi bi-plus-circle-fill"></i>
          <p className="mb-0">Tạo suất diễn</p>
        </button>
      </div>

     <Dialog open={showTicketPopup} className="popup-overlay" onClose={() => setShowTicketPopup(false)} fullWidth maxWidth="sm">
        <Box className="popup" sx={{maxWidth : "700px"}} >
          <DialogTitle sx={{ position: 'relative' }}>
            <Typography variant="h6" align="center" sx={{ color: "#FFF" }} component="span">
              {isEditing ? 'Chỉnh sửa loại vé' : 'Tạo loại vé mới'}
            </Typography>
            <IconButton aria-label="close" onClick={() => setShowTicketPopup(false)} sx={{ color: "red", position: 'absolute', right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <Box display="flex" flexDirection="column" gap={4}>

              <Box>
                <Typography variant="subtitle2" sx={{color : "#FFF" , fontSize : "15px"}} gutterBottom>
                  <Typography component="span" sx={{marginRight : "4px"}} color="error">*</Typography> 
                  Tên vé
                </Typography>
                <TextField name="TenVe" value={newTicket.TenVe} onChange={handleTicketChange} variant="outlined" fullWidth sx={{ backgroundColor: "#FFF", borderRadius: "4px" }}/>
              </Box>

              <Box display="flex" gap={2}>
                <Box flex={1}>
                  <Typography variant="subtitle2" sx={{color : "#FFF" , fontSize : "15px"}} gutterBottom>
                    <Typography component="span" sx={{marginRight : "4px"}} color="error">*</Typography> 
                    Giá vé
                  </Typography>
                  <NumericFormat
                    customInput={TextField} label="" value={newTicket.GiaVe} thousandSeparator="." decimalSeparator=","
                    allowNegative={false} onValueChange={handlePriceChange} variant="outlined" fullWidth
                    sx={{ backgroundColor: "#FFF", borderRadius: "4px" }}/>
                </Box>

                <Box flex={1}>
                  <Typography variant="subtitle2" sx={{color : "#FFF" , fontSize : "15px"}} gutterBottom>
                    <Typography component="span" sx={{marginRight : "4px"}} color="error">*</Typography> 
                     Số lượng vé
                  </Typography>
                  <TextField
                    type="number" name="SoLuongVe" value={newTicket.SoLuongVe} onChange={handleTicketChange} variant="outlined" inputProps={{ min: 0 }} fullWidth
                    sx={{ backgroundColor: "#FFF", borderRadius: "4px" }} />
                </Box>

                <Box flex={1}>
                  <Typography variant="subtitle2" sx={{color : "#FFF" , fontSize : "15px"}} gutterBottom>
                    <Typography component="span" sx={{marginRight : "4px"}} color="error">*</Typography>
                     Số vé tối đa trong đơn hàng
                  </Typography>
                  <TextField type="number" name="SoLuongToiDaMotDon"
                    value={newTicket.SoLuongToiDaMotDon} onChange={handleTicketChange} 
                    variant="outlined" inputProps={{ min: 0 }} fullWidth sx={{ backgroundColor: "#FFF", borderRadius: "4px" }}/>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{color : "#FFF" , fontSize : "15px"}} gutterBottom>Thông tin chi tiết vé</Typography>
                <TextField name="ThongTinVe" value={newTicket.ThongTinVe || ''} onChange={handleTicketChange}
                  variant="outlined" multiline rows={4} fullWidth inputProps={{ maxLength: 1000 }}
                  sx={{ backgroundColor: "#FFF", borderRadius: "4px" }}/>
              </Box>

            </Box>
          </DialogContent>

          <DialogActions>
            <Button fullWidth sx={{ backgroundColor: "#2dc275" }} variant="contained" onClick={saveTicket}>
              {isEditing ? 'Cập nhật' : 'Lưu'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default Create_ticket;