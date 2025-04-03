import express from 'express';
import { getNguoiDung, getNguoiDungByID, createNguoiDung, updateNguoiDung, deleteNguoiDung } from '../controllers/NguoiDung.js';
import {authenticate, authorize} from "../Middleware/Authen"
const router = express.Router();

router.get('/NguoiDungs', authenticate, authorize(["Admin"]), getNguoiDung);

router.get('/NguoiDungs/:idNguoiDung', authenticate, (req, res, next) => {
    if (req.user.QuyenHan === "Admin" || req.user.userId === req.params.IDNguoiDung) {
        return next();
    }
    return res.status(403).json({ message: "Không có quyền truy cập!" });
}, getNguoiDungByID);


router.post('/NguoiDungs', createNguoiDung);

router.put('/NguoiDungs/:idNguoiDung', authenticate, (req, res, next) => {
    if (req.user.QuyenHan === "Admin" || req.user.userId === req.params.idNguoiDung) {
        return next();
    }
    return res.status(403).json({ message: "Không có quyền chỉnh sửa!" });
}, updateNguoiDung);


router.delete('/NguoiDungs/:idNguoiDung', authenticate, authorize(["Admin"]), deleteNguoiDung);

export default router;

