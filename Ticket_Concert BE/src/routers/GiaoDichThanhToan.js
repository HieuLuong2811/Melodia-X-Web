import express from 'express';
import { 
    getAllGiaoDich, 
    getGiaoDichByID, 
    createGiaoDich, 
    updateGiaoDich, 
    deleteGiaoDich, 
} from '../controllers/GiaoDichThanhToan.js';

const router = express.Router();

router.get('/GiaoDichs', getAllGiaoDich);
router.get('/GiaoDichs/:idGiaoDich', getGiaoDichByID);
router.post('/GiaoDichs', createGiaoDich);
router.put('/GiaoDichs/:idGiaoDich', updateGiaoDich);
router.delete('/GiaoDichs/:idGiaoDich', deleteGiaoDich);

export default router;
