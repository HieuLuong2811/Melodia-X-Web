import express from "express";
import { getSuKien, getSuKienById, createSuKienlist, updateSuKien, deleteSuKien, getSuKienChiTiet} from "../controllers/SuKien.js";
import { authenticate, authorize } from "../Middleware/Authen";

const router = express.Router();

router.get("/SuKiens", getSuKien);

router.get("/Admin/SuKiens", authenticate, authorize(["Admin"]), getSuKien);

router.get("/Admin/SuKiens/:idSuKien", authenticate, authorize(["Admin"]), getSuKienChiTiet);

router.get("/SuKiens/:idSuKien", getSuKienById);

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
