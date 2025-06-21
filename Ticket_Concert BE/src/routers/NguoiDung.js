import express from 'express';
import NguoiDungController from '../controllers/NguoiDung.js';
import {authenticate, authorize} from "../Middleware/Authen.js"
const router = express.Router();

router.get('/NguoiDungs', authenticate, authorize(["Admin"]), NguoiDungController.getNguoiDungCtrl);

router.get('/NguoiDungs/:idNguoiDung', authenticate, (req, res, next) => {
    if (req.user.QuyenHan === "Admin" || req.user.userId === req.params.IDNguoiDung) {
        return next();
    }
    return res.status(403).json({ message: "Không có quyền truy cập!" });
}, NguoiDungController.getNguoiDungByIdCtrl);


router.post('/NguoiDungs', NguoiDungController.createNguoiDungCtrl);

router.put('/NguoiDungs/:idNguoiDung', authenticate, (req, res, next) => {
    if (req.user.QuyenHan === "Admin" || req.user.userId === req.params.IDNguoiDung) {
        return next();
    }
    return res.status(403).json({ message: "Không có quyền chỉnh sửa!" });
}, NguoiDungController.updateNguoiDungCtrl);

router.put('/NguoiDungTrangThai/:idNguoiDung', authenticate, authorize(["Admin"]), NguoiDungController.lockOrUnlockUser);


router.delete('/NguoiDungs/:idNguoiDung', authenticate, authorize(["Admin"]), NguoiDungController.deleteNguoiDungCtrl);

export default router;

