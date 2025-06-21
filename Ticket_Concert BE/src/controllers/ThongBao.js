import ThongBaoModel from "../models/ThongBao.js"
import { v4 as uuidv4 } from 'uuid';

const getThongBaodata = (data) => ({
    idNguoiDung: data.IDNguoiDung,
    tieuDe: data.TieuDe,
    noiDung : data.NoiDung,
    ngayTao: new Date(),
    trangThai: data.TrangThai || "Chưa đọc"
});

const ThongBaoController = {
    getThongBaosByIDCtrl: async (req, res) => {
        try {
            const data = await ThongBaoModel.getThongBaoByID(req.params.idNguoiDung);
            res.status(200).json(data);
        }catch (error){
            console.error(error);
            res.status(500).json({ error: "Lỗi khi lấy thông báo"})
        }
    },
    createThongBaoCtrl: async (req, res) => {
        try {
            const idThongBao = uuidv4();
            const data = getThongBaodata(req.body);
            await ThongBaoModel.createThongBao(idThongBao, data);
            res.status(201).json({ message: "Thông báo đã được tạo thành công", idThongBao });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi khi tạo thông báo" });
        }
    },
    updateTrangThaiThongBaoCtrl: async (req, res) => {
        try {
            const { idThongBao } = req.params;
            const { TrangThai } = req.body;
            await ThongBaoModel.updateTrangThaiThongBao(idThongBao, TrangThai);
            res.status(200).json({ message: "Trạng thái thông báo đã được cập nhật thành công" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi khi cập nhật trạng thái thông báo" });
        }
    },
    deleteThongBaoCtrl: async (req, res) => {
        try {
            const { idThongBao } = req.params;
            const { IDNguoiDung } = req.body;
            await ThongBaoModel.deleteThongBao(idThongBao, IDNguoiDung);
            res.status(200).json({ message: "Thông báo đã được xóa thành công" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi khi xóa thông báo" });
        }
    },
    getSoLuongThongBaoChuaDocCtrl: async (req, res) => {
        try {
            const soLuong = await ThongBaoModel.getSoLuongThongBaoChuaDoc(req.params.idNguoiDung);
            res.status(200).json({ soLuong });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi khi lấy số lượng thông báo chưa đọc" });
        }
    }
};

export default ThongBaoController;