import express from 'express';
import { 
    getDanhGia, 
    getDanhGiaByID, 
    createDanhGia, 
    updateDanhGia, 
    deleteDanhGia 
} from '../controllers/DanhGia.js';

const router = express.Router();

router.get('/DanhGias', getDanhGia);
router.get('/DanhGias/:idDanhGia', getDanhGiaByID);
router.post('/DanhGias', createDanhGia);
router.put('/DanhGias/:idDanhGia', updateDanhGia);
router.delete('/DanhGias/:idDanhGia', deleteDanhGia);

export default router;
