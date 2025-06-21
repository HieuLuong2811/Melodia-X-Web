import express from 'express';
import LoaiSuKienController from '../controllers/LoaiSuKien.js';
import {authenticate, authorize} from "../Middleware/Authen.js"

const router = express.Router();

router.get('/LoaiSuKiens', LoaiSuKienController.getLoaiSuKienCtrl);

router.get(`/LoaiSuKiens/:idLoaiSuKien`, authenticate, authorize(["Admin"]), LoaiSuKienController.getLoaiSuKienByIDCtrl);

router.post('/LoaiSuKiens', authenticate, authorize(["Admin"]), LoaiSuKienController.createLoaiSuKienCtrl);

router.put('/LoaiSuKiens/:idLoaiSuKien', authenticate, authorize(["Admin"]), LoaiSuKienController.updateLoaiSuKienCtrl);

router.delete('/LoaiSuKiens/:idLoaiSuKien', authenticate, authorize(["Admin"]), LoaiSuKienController.deleteLoaiSuKienCtrl);

export default router;
