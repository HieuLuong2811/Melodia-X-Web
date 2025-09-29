import { useCallback } from "react";
import { LoaiVe } from "@/interfaces/LoaiVe";
import { VeKhuVuc } from "@/interfaces/LoaiKhuVuc";
import { NumberFormatValues } from "react-number-format";
import { NumericFormat } from "react-number-format";
import Swal from "sweetalert2";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../create-ticket.css"

interface LoaiVeExtended extends LoaiVe {
  IDKhuVuc?: string;
  TenKhuVuc?: string;
}

interface TicketPopupProps {
  showTicketPopup: boolean;
  setShowTicketPopup: (value: boolean) => void;
  currentShowtimeId: string | null;
  currentKhuVucId: string | null;
  currentKhuVucName: string | null; 
  newTicket: LoaiVeExtended;
  setNewTicket: React.Dispatch<React.SetStateAction<LoaiVeExtended>>;
  isEditing: boolean;
  loaiVes: string | null;
  isEditMode: boolean;
  setTickets: React.Dispatch<React.SetStateAction<LoaiVeExtended[]>>;
  setVeKhuVucs: React.Dispatch<React.SetStateAction<VeKhuVuc[]>>;
}

const TicketPopup = ({
  showTicketPopup,
  setShowTicketPopup,
  currentShowtimeId,
  currentKhuVucName, 
  newTicket,
  setNewTicket,
  isEditing,
  loaiVes,
  isEditMode,
  setTickets,
  setVeKhuVucs,
}: TicketPopupProps) => {
  const handleTicketChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (name in newTicket) {
        setNewTicket((prev: LoaiVeExtended) => {
          const updatedValue =
            name === "SoLuongVe" || name === "SoLuongToiDaMotDon"
              ? parseInt(value) || 0
              : value;
          return {
            ...prev,
            [name]: updatedValue,
          } as LoaiVeExtended;
        });
      }
    },
    [setNewTicket]
  );

  const handlePriceChange = useCallback(
    (values: NumberFormatValues) => {
      const { floatValue } = values;
      setNewTicket((prev: LoaiVeExtended) => ({
        ...prev,
        GiaVe: floatValue !== undefined ? floatValue : 0,
      }));
    },
    [setNewTicket]
  );

  const saveTicket = useCallback(async () => {
    if (!newTicket.TenVe || !newTicket.GiaVe || !newTicket.SoLuongVe || !newTicket.IDKhuVuc || !currentShowtimeId) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập đầy đủ thông tin (Tên vé, Giá vé, Số lượng vé, Khu vực, Suất diễn)",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    let idLoaiVe = newTicket.IDLoaiVe;

    try {
      if (isEditing) {
        if (isEditMode) {
          if (!loaiVes) {
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: "Không tìm thấy ID loại vé để cập nhật",
              timer: 2000,
              showConfirmButton: false,
            });
            return;
          }

          const newLoaive = {
            IDSuatDien: currentShowtimeId,
            TenVe: newTicket.TenVe,
            GiaVe: newTicket.GiaVe,
            SoLuongVe: parseInt(newTicket.SoLuongVe.toString()),
            SoLuongToiDaMotDon: parseInt(newTicket.SoLuongToiDaMotDon.toString()),
            AnhVe: newTicket.AnhVe || "",
            ThongTinVe: newTicket.ThongTinVe,
          };

          const updatedLoaiVe = await LoaiVeService.updateLoaiVe(loaiVes, newLoaive);
          setTickets((prev) =>
            prev.map((t) => (t.IDLoaiVe === updatedLoaiVe.IDLoaiVe ? { ...updatedLoaiVe, IDKhuVuc: newTicket.IDKhuVuc } : t))
          );
          Swal.fire({
            icon: "success",
            title: "Sửa thông tin loại vé thành công",
            text: "Loại vé đã được sửa",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          setTickets((prev) =>
            prev.map((ticket) =>
              ticket.IDLoaiVe === newTicket.IDLoaiVe
                ? {
                    ...ticket,
                    TenVe: newTicket.TenVe,
                    GiaVe: newTicket.GiaVe,
                    SoLuongVe: parseInt(newTicket.SoLuongVe.toString()),
                    SoLuongToiDaMotDon: parseInt(newTicket.SoLuongToiDaMotDon.toString()),
                    AnhVe: newTicket.AnhVe || "",
                    ThongTinVe: newTicket.ThongTinVe,
                    IDKhuVuc: newTicket.IDKhuVuc,
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
        if (isEditMode) {
          const newLoaive = {
            IDSuatDien: currentShowtimeId,
            TenVe: newTicket.TenVe,
            GiaVe: newTicket.GiaVe,
            SoLuongVe: parseInt(newTicket.SoLuongVe.toString()),
            SoLuongToiDaMotDon: parseInt(newTicket.SoLuongToiDaMotDon.toString()),
            AnhVe: newTicket.AnhVe || "",
            ThongTinVe: newTicket.ThongTinVe || "",
          };

          const createdLoaiVe = await LoaiVeService.createLoaiVe(newLoaive);
          idLoaiVe = createdLoaiVe.IDLoaiVe;
          setTickets((prev) => [...prev, { ...createdLoaiVe, IDKhuVuc: newTicket.IDKhuVuc }]);
          Swal.fire({
            icon: "success",
            title: "Tạo loại vé thành công",
            text: "Loại vé mới đã được thêm",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          const newTicketData: LoaiVeExtended = {
            IDLoaiVe: `TEMP-TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            IDSuatDien: currentShowtimeId,
            TenVe: newTicket.TenVe,
            AnhVe: newTicket.AnhVe || "",
            GiaVe: newTicket.GiaVe,
            SoLuongVe: parseInt(newTicket.SoLuongVe.toString()),
            SoLuongToiDaMotDon: parseInt(newTicket.SoLuongToiDaMotDon.toString()),
            ThongTinVe: newTicket.ThongTinVe || "",
            IDKhuVuc: newTicket.IDKhuVuc,
          };
          idLoaiVe = newTicketData.IDLoaiVe;
          setTickets((prev) => [...prev, newTicketData]);
          Swal.fire({
            icon: "success",
            title: "Tạo thành công",
            text: "Tạo loại vé thành công",
            timer: 1500,
            showConfirmButton: false,
          });
        }

        const newVeKhuVuc: VeKhuVuc = {
          IDVeGhe: `TEMP-VE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          IDLoaiVe: idLoaiVe!,
          IDKhuVuc: newTicket.IDKhuVuc,
          IDSuatDien: currentShowtimeId,
        };
        setVeKhuVucs((prev) => [...prev, newVeKhuVuc]);
      }

      setNewTicket({
        IDLoaiVe: "",
        TenVe: "",
        GiaVe: 0,
        SoLuongVe: 0,
        SoLuongToiDaMotDon: 0,
        AnhVe: undefined,
        ThongTinVe: "",
        IDKhuVuc: "",
      });
      setShowTicketPopup(false);
    } catch (error) {
      console.error("Lỗi khi lưu vé:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã có lỗi xảy ra khi lưu vé. Vui lòng thử lại sau.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }, [newTicket, currentShowtimeId, isEditing, isEditMode, loaiVes, setTickets, setVeKhuVucs, setNewTicket, setShowTicketPopup]);

  return (
    <Dialog open={showTicketPopup} className="popup-overlay" onClose={() => setShowTicketPopup(false)} fullWidth maxWidth="sm">
      <Box className="popup" sx={{ maxWidth: "700px" }}>
        <DialogTitle sx={{ position: "relative" }}>
          <Typography
            component="div"
            variant="h6"
            align="center"
            sx={{ color: "#FFF" }}
          >
            {isEditing ? "Chỉnh sửa loại vé" : "Tạo loại vé mới"} {currentKhuVucName && `(Khu vực: ${currentKhuVucName})`}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setShowTicketPopup(false)}
            sx={{ color: "red", position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: "#FFF", fontSize: "15px", mb: 1 }}>
                <Typography component="span" sx={{ color: "red", mr: 0.5 }}>
                  *
                </Typography>
                Tên vé
              </Typography>
              <TextField
                name="TenVe"
                value={newTicket.TenVe}
                onChange={handleTicketChange}
                variant="outlined"
                fullWidth
                sx={{ backgroundColor: "#FFF", borderRadius: "4px" }}
                error={!newTicket.TenVe}
                helperText={!newTicket.TenVe ? "Tên vé là bắt buộc" : ""}
              />
            </Box>
            <Box display="flex" gap={2}>
              <Box flex={1}>
                <Typography variant="subtitle2" sx={{ color: "#FFF", fontSize: "15px", mb: 1 }}>
                  <Typography component="span" sx={{ color: "red", mr: 0.5 }}>
                    *
                  </Typography>
                  Giá vé
                </Typography>
                <NumericFormat
                  customInput={TextField}
                  value={newTicket.GiaVe}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  onValueChange={handlePriceChange}
                  variant="outlined"
                  fullWidth
                  sx={{ backgroundColor: "#FFF", borderRadius: "4px" }}
                  error={newTicket.GiaVe <= 0}
                  helperText={newTicket.GiaVe <= 0 ? "Giá vé phải lớn hơn 0" : ""}
                />
              </Box>
              <Box flex={1}>
                <Typography variant="subtitle2" sx={{ color: "#FFF", fontSize: "15px", mb: 1 }}>
                  <Typography component="span" sx={{ color: "red", mr: 0.5 }}>
                    *
                  </Typography>
                  Số lượng vé
                </Typography>
                <TextField
                  type="number"
                  name="SoLuongVe"
                  value={newTicket.SoLuongVe}
                  onChange={handleTicketChange}
                  variant="outlined"
                  inputProps={{ min: 0 }}
                  fullWidth
                  sx={{ backgroundColor: "#FFF", borderRadius: "4px" }}
                  error={newTicket.SoLuongVe <= 0}
                  helperText={newTicket.SoLuongVe <= 0 ? "Số lượng vé phải lớn hơn 0" : ""}
                />
              </Box>
              <Box flex={1}>
                <Typography variant="subtitle2" sx={{ color: "#FFF", fontSize: "15px", mb: 1 }}>
                  <Typography component="span" sx={{ color: "red", mr: 0.5 }}>
                    *
                  </Typography>
                  Số vé tối đa trong đơn hàng
                </Typography>
                <TextField
                  type="number"
                  name="SoLuongToiDaMotDon"
                  value={newTicket.SoLuongToiDaMotDon}
                  onChange={handleTicketChange}
                  variant="outlined"
                  inputProps={{ min: 1 }}
                  fullWidth
                  sx={{ backgroundColor: "#FFF", borderRadius: "4px" }}
                  error={newTicket.SoLuongToiDaMotDon <= 0}
                  helperText={newTicket.SoLuongToiDaMotDon <= 0 ? "Số lượng tối đa phải lớn hơn 0" : ""}
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: "#FFF", fontSize: "15px", mb: 1 }}>
                Thông tin chi tiết vé
              </Typography>
              <TextField
                name="ThongTinVe"
                value={newTicket.ThongTinVe || ""}
                onChange={handleTicketChange}
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                inputProps={{ maxLength: 1000 }}
                sx={{ backgroundColor: "#FFF", borderRadius: "4px" }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth
            sx={{ backgroundColor: "#2dc275" }}
            variant="contained"
            onClick={saveTicket}
            disabled={!newTicket.TenVe || newTicket.GiaVe <= 0 || newTicket.SoLuongVe <= 0 || newTicket.SoLuongToiDaMotDon <= 0}
          >
            {isEditing ? "Cập nhật" : "Lưu"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default TicketPopup;