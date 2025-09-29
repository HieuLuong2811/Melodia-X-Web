import express from 'express';
import KhuVucController from '../controllers/KhuVuc.js';

const router = express.Router();

router.get('/KhuVucs', KhuVucController.getAllKhuVucCtrl);
router.get(`/KhuVucs/:idKhuVuc`, KhuVucController.getKhuVucByIdCtrl);

export default router;