import { useState } from "react";
import { useCollapse } from "react-collapsed";
import { LoaiVe } from "@/interfaces/LoaiVe";
import { SuatDien2 } from "@/interfaces/SuatDien";
import { VeKhuVuc } from "@/interfaces/LoaiKhuVuc";
import { DisplayEventTime } from "@/components/DisplayEventTime";
import SeatMap from "@/components/seatMap";

interface LoaiVeExtended extends LoaiVe {
  IDKhuVuc?: string;
  TenKhuVuc?: string;
}

interface ShowtimeItemProps {
  showtime: SuatDien2;
  tickets: LoaiVeExtended[];
  veKhuVucs: VeKhuVuc[];
  handleShowtimeChange: (id: string, field: "ThoiGianBatDau" | "ThoiGianKetThuc", value: string) => void;
  deleteShowtime: (showtimeId: string) => void;
  openTicketPopup: (showtimeId: string, idKhuVuc: string, tenKhuVuc: string, isEditing: boolean, ticket?: LoaiVeExtended) => void;
  editTicket: (ticket: LoaiVeExtended) => void;
  deleteTicket: (ticketId: string) => void;
}

const ShowtimeItem = ({
  showtime,
  tickets,
  handleShowtimeChange,
  deleteShowtime,
  openTicketPopup,
  editTicket,
  deleteTicket,
}: ShowtimeItemProps) => {
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  const handleSelectKhuVuc = (idKhuVuc: string, tenKhuVuc: string) => {
    const existingTicket = tickets.find((ticket) => ticket.IDSuatDien === showtime.IDSuatDien && ticket.IDKhuVuc === idKhuVuc);
    openTicketPopup(showtime.IDSuatDien, idKhuVuc, tenKhuVuc, !!existingTicket, existingTicket);
  };

  return (
    <div className="SuatDien w-100">
      <div
        {...getToggleProps({ onClick: () => setExpanded((prev) => !prev) })}
        className="ticket rounded justify-content-between w-100 d-flex text-black p-2 ps-3 pe-3 align-items-center gap-3"
      >
        <div className="icon">
          <i className={`bi ${isExpanded ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
        </div>
        <div className="w-100">
          <div className="d-flex align-items-center fw-bold gap-2">
            <DisplayEventTime start={showtime.ThoiGianBatDau || "Chưa chọn"} end={showtime.ThoiGianKetThuc || "Chưa chọn"} />
          </div>
          <p className="mb-0">{tickets.filter((t) => t.IDSuatDien === showtime.IDSuatDien).length} loại vé</p>
        </div>
        <span className="fs-4">⋮</span>
      </div>
      <section {...getCollapseProps()} className="w-100 mt-2">
        <div className="ticket-time d-flex rounded-1 flex-column p-2 ps-3 pb-4 pe-3 gap-3 w-100">
          <div onClick={() => setExpanded(false)} className="text-white justify-content-between w-100 d-flex align-items-center gap-3">
            <div className="icon">
              <i className="bi bi-chevron-up"></i>
            </div>
            <div className="w-100">
              <p className="mb-0">Ngày sự kiện</p>
            </div>
            <span onClick={() => deleteShowtime(showtime.IDSuatDien)}>❌</span>
          </div>
          <div className="d-flex mt-3 justify-content-between gap-5">
            <div className="w-50">
              <label className="mb-2 border-0">Thời gian bắt đầu</label>
              <input
                type="datetime-local"
                className="form-control datetime"
                value={showtime.ThoiGianBatDau}
                onChange={(e) => handleShowtimeChange(showtime.IDSuatDien, "ThoiGianBatDau", e.target.value)}
              />
            </div>
            <div className="w-50">
              <label className="mb-2 border-0">Thời gian kết thúc</label>
              <input
                type="datetime-local"
                className="form-control datetime"
                value={showtime.ThoiGianKetThuc}
                onChange={(e) => handleShowtimeChange(showtime.IDSuatDien, "ThoiGianKetThuc", e.target.value)}
              />
            </div>
          </div>
          <div className="d-flex flex-column">
            <label className="mb-2 border-0">Chọn khu vực để tạo/sửa vé</label>
            <SeatMap onSelect={handleSelectKhuVuc} />
          </div>
          {tickets
            .filter((ticket) => ticket.IDSuatDien === showtime.IDSuatDien)
            .map((ticket) => (
              <div
                key={ticket.IDLoaiVe}
                className="ticket-item mt-2 d-flex justify-content-between align-items-center w-100 px-3 py-2 rounded"
                style={{ background: "rgb(65, 70, 82)", border: "1px solid rgb(56, 56, 61)" }}
              >
                <div className="d-flex align-items-center gap-2 flex-wrap text-white">
                  <i className="bi bi-list mt-1"></i>
                  <i className="bi bi-ticket-perforated mt-1"></i>
                  <span>
                    <strong>Vé {ticket.TenVe} (Khu vực: {ticket.TenKhuVuc})</strong>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i
                    className="bi bi-pencil-square text-black bg-white p-2 ib-1 rounded"
                    style={{ cursor: "pointer" }}
                    title="Chỉnh sửa"
                    onClick={() => editTicket(ticket)}
                  ></i>
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

export default ShowtimeItem;