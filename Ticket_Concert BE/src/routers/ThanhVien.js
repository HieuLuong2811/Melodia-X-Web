import express from "express";
import {getThanhVienByID, createThanhVien, updateThanhVien, deleteThanhVien} from '../controllers/ThanhVien';
import { authenticate, authorize } from "../Middleware/Authen";


const router = express.Router();

router.get("/ThanhViens/:idSuKien", authenticate, authorize(["User"]), getThanhVienByID);
router.post("/ThanhViens", authenticate, authorize(["User"]), createThanhVien);
router.put("/ThanhViens/:idThanhVien", authenticate, authorize(["User"]), updateThanhVien);
router.delete("/ThanhViens/:idThanhVien", authenticate, authorize(["User"]), deleteThanhVien);

export default router;