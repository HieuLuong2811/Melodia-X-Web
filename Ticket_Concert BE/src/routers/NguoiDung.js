import express from 'express';
import { getNguoiDung, getNguoiDungById, createNguoiDung, lockOrUnlockUser, updateNguoiDung, deleteNguoiDung } from '../controllers/NguoiDung.js';
import {authenticate, authorize} from "../Middleware/Authen"
const router = express.Router();

router.get('/NguoiDungs', authenticate, authorize(["Admin"]), getNguoiDung);

router.get('/NguoiDungs/:idNguoiDung', authenticate, (req, res, next) => {
    if (req.user.QuyenHan === "Admin" || req.user.userId === req.params.IDNguoiDung) {
        return next();
    }
    return res.status(403).json({ message: "Không có quyền truy cập!" });
}, getNguoiDungById);


router.post('/NguoiDungs', createNguoiDung);

router.put('/NguoiDungs/:idNguoiDung', authenticate, (req, res, next) => {
    if (req.user.QuyenHan === "Admin" || req.user.userId === req.params.IDNguoiDung) {
        return next();
    }
    return res.status(403).json({ message: "Không có quyền chỉnh sửa!" });
}, updateNguoiDung);

router.put('/NguoiDungTrangThai/:idNguoiDung', authenticate, authorize(["Admin"]), lockOrUnlockUser);


router.delete('/NguoiDungs/:idNguoiDung', authenticate, authorize(["Admin"]), deleteNguoiDung);

export default router;

