import { LoaiVe } from "@/interfaces/LoaiVe";
import { SuatDien2 } from "@/interfaces/SuatDien";
import { VeKhuVuc } from "@/interfaces/LoaiKhuVuc";
import ShowtimeItem from "./showTimeItem";

interface LoaiVeExtended extends LoaiVe {
  IDKhuVuc?: string;
}

interface ShowtimeListProps {
  showtimes: SuatDien2[];
  tickets: LoaiVeExtended[];
  veKhuVucs: VeKhuVuc[];
  handleShowtimeChange: (id: string, field: "ThoiGianBatDau" | "ThoiGianKetThuc", value: string) => void;
  deleteShowtime: (showtimeId: string) => void;
  openTicketPopup: (showtimeId: string, idKhuVuc: string, tenKhuVuc: string, isEditing: boolean, ticket?: LoaiVeExtended) => void;
  editTicket: (ticket: LoaiVeExtended) => void;
  deleteTicket: (ticketId: string) => void;
}

const ShowtimeList = ({
  showtimes,
  tickets,
  veKhuVucs,
  handleShowtimeChange,
  deleteShowtime,
  openTicketPopup,
  editTicket,
  deleteTicket,
}: ShowtimeListProps) => (
  <>
    {Array.isArray(showtimes) &&
      showtimes.map((showtime, index) => (
        <ShowtimeItem
          key={showtime.IDSuatDien || `showtime-${index}`}
          showtime={showtime}
          tickets={tickets}
          veKhuVucs={veKhuVucs}
          handleShowtimeChange={handleShowtimeChange}
          deleteShowtime={deleteShowtime}
          openTicketPopup={openTicketPopup}
          editTicket={editTicket}
          deleteTicket={deleteTicket}
        />
      ))}
  </>
);

export default ShowtimeList;