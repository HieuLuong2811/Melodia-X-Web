import express from "express";
import {getSuKienUser, getSuKienAdmin, getSuKienById, SoLuongEvent ,getSuKienTongVeBan, getSuKienGanNhatMua, getSuKienCoVideo, createSuKienlist, TrangThaiSuKienController, getSuKienByIdUser, updateSuKiens, deleteSuKien, getSuKienChiTiet} from "../controllers/SuKien.js";
import { authenticate, authorize } from "../Middleware/Authen";

const router = express.Router();

router.get("/SuKiens", getSuKienUser);

router.get("/Admin/CountSuKiens",authenticate, authorize(["Admin"]), SoLuongEvent);

router.get("/Admin/SuKiensList", authenticate, authorize(["Admin"]), getSuKienAdmin);

router.get("/Admin/SuKiens/:idSuKien", authenticate, authorize(["Admin"]), getSuKienChiTiet);

router.put("/Admin/DuyetSuKien/:idSuKien", authenticate, authorize(["Admin"]), TrangThaiSuKienController);

router.get("/SuKiens/:idSuKien", getSuKienById);
router.get("/SuKiensUser/:idNguoiDung", getSuKienByIdUser);


router.post("/SuKiens", createSuKienlist);

router.put("/SuKiens/:idSuKien", authenticate, (req, res, next) => {
    if (req.user.QuyenHan === "User") {
        return next();
    }
    return res.status(403).json({ message: "Không có quyền chỉnh sửa sự kiện!" });
}, updateSuKiens);

router.delete("/SuKiens/:idSuKien", authenticate, (req, res, next) => {
    if (req.user.QuyenHan === "User") {
        return next();
    }
    return res.status(403).json({ message: "Không có quyền xóa sự kiện!" });
}, deleteSuKien);

router.get("/Special-Event/", getSuKienTongVeBan);
router.get("/Trending-Events/", getSuKienGanNhatMua);
router.get("/Title-Event/", getSuKienCoVideo);

export default router;
