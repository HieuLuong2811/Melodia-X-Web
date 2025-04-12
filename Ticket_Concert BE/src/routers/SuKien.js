import express from "express";
import { getSuKien, getSuKienAdmin, getSuKienById, createSuKienlist, DuyetSuKienControllers, getSuKienByIdUser, updateSuKien, deleteSuKien, getSuKienChiTiet} from "../controllers/SuKien.js";
import { authenticate, authorize } from "../Middleware/Authen";

const router = express.Router();

router.get("/SuKiens", getSuKien);

router.get("/Admin/SuKiens", authenticate, authorize(["Admin"]), getSuKienAdmin);

router.get("/Admin/SuKiens/:idSuKien", authenticate, authorize(["Admin"]), getSuKienChiTiet);

router.put("/Admin/DuyetSuKien/:idSuKien", authenticate, authorize(["Admin"]), DuyetSuKienControllers);

router.get("/SuKiens/:idSuKien", getSuKienById);
router.get("/SuKiensUser/:idNguoiDung", getSuKienByIdUser);


router.post("/SuKiens", createSuKienlist);

router.put("/SuKiens/:idSuKien", authenticate, (req, res, next) => {
    if (req.user.QuyenHan === "User") {
        return next();
    }
    return res.status(403).json({ message: "Không có quyền chỉnh sửa sự kiện!" });
}, updateSuKien);

router.delete("/SuKiens/:idSuKien", authenticate, (req, res, next) => {
    if (req.user.QuyenHan === "User") {
        return next();
    }
    return res.status(403).json({ message: "Không có quyền xóa sự kiện!" });
}, deleteSuKien);

export default router;
