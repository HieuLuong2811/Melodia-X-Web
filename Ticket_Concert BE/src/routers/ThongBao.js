import express from "express";
import ThongBaoController from '../controllers/ThongBao.js';
import {authenticate} from "../Middleware/Authen.js"

const router = express.Router();

router.get("/thongBao/:idNguoiDung", authenticate, ThongBaoController.getThongBaosByIDCtrl);
router.post("/thongBao", authenticate, ThongBaoController.createThongBaoCtrl);
router.put("/thongBao/:idThongBao", authenticate, ThongBaoController.updateTrangThaiThongBaoCtrl);
router.delete("/thongBao/:idThongBao", authenticate, ThongBaoController.deleteThongBaoCtrl);
router.get("/thongBao/soLuong/:idNguoiDung", authenticate, ThongBaoController.getSoLuongThongBaoChuaDocCtrl);

export default router;