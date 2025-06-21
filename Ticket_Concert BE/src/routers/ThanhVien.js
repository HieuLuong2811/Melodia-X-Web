import express from "express";
import ThanhVienController from '../controllers/ThanhVien.js';
import {authenticate, authorize} from "../Middleware/Authen.js"


const router = express.Router();

router.get("/ThanhViens/:idSuKien", authenticate, authorize(["User"]), ThanhVienController.getThanhVienByIDCtrl);
router.post("/ThanhViens", authenticate, authorize(["User"]), ThanhVienController.createThanhVienCtrl);
router.put("/ThanhViens/:idThanhVien", authenticate, authorize(["User"]), ThanhVienController.updateThanhVienCtrl);
router.delete("/ThanhViens/:idThanhVien", authenticate, authorize(["User"]), ThanhVienController.deleteThanhVienCtrl);

export default router;