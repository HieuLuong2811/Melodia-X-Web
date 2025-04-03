import express from "express";
import {
    getSuKien,
    getSuKienById,
    createSuKien,
    updateSuKien,
    deleteSuKien
} from "../controllers/SuKien.js";
import { authenticate, authorize } from "../Middleware/Authen";

const router = express.Router();

router.get("/SuKiens", getSuKien);

router.get("/SuKiens/:idSuKien", getSuKienById);

router.post("/SuKiens", authenticate, (req, res, next) => {
    if (req.user.QuyenHan === "User") {
        return next();
    }
    return res.status(403).json({ message: "Không có quyền tạo sự kiện!" });
}, createSuKien);

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
