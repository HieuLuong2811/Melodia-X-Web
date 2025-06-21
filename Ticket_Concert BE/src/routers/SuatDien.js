import express from 'express';
import SuatDienController from '../controllers/SuatDien.js';
import {authenticate, authorize} from "../Middleware/Authen.js"

const router = express.Router();

router.get('/SuatDiens', SuatDienController.getAllSuatDiensCtrl);
router.get('/SuatDiens/:idSuKien', SuatDienController.getSuatDienByIDSuKienCtrl);
router.post('/SuatDiens', authenticate, authorize(["User"]), SuatDienController.createSuatDienCtrl);
router.put('/SuatDiens/:idSuatDien',authenticate, authorize(["User"]), SuatDienController.updateSuatDienCtrl);
router.delete('/SuatDiens/:idSuatDien', authenticate, authorize(["User"]), SuatDienController.deleteSuatDienCtrl);

export default router;
