import express from "express";
import SuKienController from "../controllers/SuKien.js";
import {authenticate, authorize} from "../Middleware/Authen.js"

const router = express.Router();

router.get("/SuKiens", SuKienController.getSuKienUserCtrl);

router.get("/Admin/CountSuKiens",authenticate, authorize(["Admin"]), SuKienController.SoLuongEventCtrl);

router.get("/Admin/SuKiensList", authenticate, authorize(["Admin"]), SuKienController.getSuKienAdminCtrl);

router.get("/Admin/SuKiens/:idSuKien", authenticate, authorize(["Admin"]), SuKienController.getSuKienChiTietCtrl);

router.put("/Admin/DuyetSuKien/:idSuKien", authenticate, authorize(["Admin"]), SuKienController.TrangThaiSuKienCtrl);

router.get("/SuKiens/:idSuKien", SuKienController.getSuKienByIdFromDBCtrl);
router.get("/SuKiensUser/:idNguoiDung", SuKienController.getSuKienByIdUserCtrl);


router.post("/SuKiens", SuKienController.createSuKienCtrl);

router.put("/SuKiens/:idSuKien", authenticate, (req, res, next) => {
    if (req.user.QuyenHan === "User") {
        return next();
    }
    return res.status(403).json({ message: "Không có quyền chỉnh sửa sự kiện!" });
}, SuKienController.updateSuKienCtrl);

router.delete("/SuKiens/:idSuKien", authenticate, (req, res, next) => {
    if (req.user.QuyenHan === "User") {
        return next();
    }
    return res.status(403).json({ message: "Không có quyền xóa sự kiện!" });
}, SuKienController.deleteSuKienCtrl);

router.get("/Special-Event/", SuKienController.getSuKienTongVeBanCtrl);
router.get("/Trending-Events/", SuKienController.getSuKienGanNhatMuaCtrl);
router.get("/Title-Event/", SuKienController.getSuKienCoVideoCtrl);

export default router;
