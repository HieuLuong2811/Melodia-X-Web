// routes/dashboardRoutes.js
import express from 'express';
import { DoanhThuCtrl, SoLuongVeCtrl, SoLuongVeTonKhoCtrl, countaccCtrl} from '../controllers/dashboardController.js';
import dashboardController from '../controllers/dashboardController.js';
import {authenticate, authorize} from "../Middleware/Authen.js"

const router = express.Router();

router.get('/stats',authenticate, authorize(["Admin"]), dashboardController.getStatsCtrl);
router.get('/revenue',authenticate, authorize(["Admin"]), dashboardController.getRevenueStatsCtrl);
router.get('/event-types',authenticate, authorize(["Admin"]), dashboardController.getEventStatsCtrl);
router.get('/recent-events',authenticate, authorize(["Admin"]), dashboardController.getRecentEventsCtrl);
router.get('/AccHoatDong',authenticate, authorize(["Admin"]), countaccCtrl);
 
router.get('/doanhthu/:idSuatDien', DoanhThuCtrl);
router.get('/soluongve/:idSuatDien', SoLuongVeCtrl);
router.get('/soluongvetonkho/:idSuatDien', SoLuongVeTonKhoCtrl);


export default router;