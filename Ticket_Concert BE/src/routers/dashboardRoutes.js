// routes/dashboardRoutes.js
import express from 'express';
import dashboardController from '../controllers/dashboardController';
import {authenticate, authorize} from "../Middleware/Authen"

const router = express.Router();

router.get('/stats',authenticate, authorize(["Admin"]), dashboardController.getStats);
router.get('/revenue',authenticate, authorize(["Admin"]), dashboardController.getRevenueStats);
// router.get('/tickets',authenticate, authorize(["Admin"]), dashboardController.getTicketStats);
router.get('/event-types',authenticate, authorize(["Admin"]), dashboardController.getEventStats);
router.get('/recent-events',authenticate, authorize(["Admin"]), dashboardController.getRecentEvents);

export default router;