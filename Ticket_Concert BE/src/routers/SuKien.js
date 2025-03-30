import express from "express";
import {
    getSuKien,
    getSuKienByID,
    createSuKienController,
    updateSuKienController,
    deleteSuKienController
} from "../controllers/SuKien.js";

const router = express.Router();

router.get("/SuKiens", getSuKien);
router.get("/SuKiens/:idSuKien", getSuKienByID);
router.post("/SuKiens/", createSuKienController);
router.put("/SuKiens/:idSuKien", updateSuKienController);
router.delete("/SuKiens/:idSuKien", deleteSuKienController);

export default router;

