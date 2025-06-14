// routes/dashboardRoutes.js
import express from 'express';
import { DoanhThu, SoLuongVe, countacc} from '../controllers/dashboardController';
import dashboardController from '../controllers/dashboardController';
import {authenticate, authorize} from "../Middleware/Authen"

const router = express.Router();

router.get('/stats',authenticate, authorize(["Admin"]), dashboardController.getStats);
router.get('/revenue',authenticate, authorize(["Admin"]), dashboardController.getRevenueStats);
// router.get('/tickets',authenticate, authorize(["Admin"]), dashboardController.getTicketStats);
router.get('/event-types',authenticate, authorize(["Admin"]), dashboardController.getEventStats);
router.get('/recent-events',authenticate, authorize(["Admin"]), dashboardController.getRecentEvents);
router.get('/AccHoatDong',authenticate, authorize(["Admin"]), countacc);
 
router.get('/doanhthu/:idSuatDien', DoanhThu);
router.get('/soluongve/:idSuatDien', SoLuongVe);


export default router;