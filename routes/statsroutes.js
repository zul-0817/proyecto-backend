import express from "express";
import { obtenerEstadisticas } from "../controllers/statsController.js";

const router = express.Router();

router.get("/", obtenerEstadisticas);

export default router;
