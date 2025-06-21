import express from "express";
import LoginController from "../controllers/login.js";

const router = express.Router();

router.post("/login", LoginController.loginUser);
router.post("/register", LoginController.registerUser);

export default router;
