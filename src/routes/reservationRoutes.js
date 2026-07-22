import express from "express";
import { crearReserva, listarReservas } from "../controllers/reservationController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verificarToken, crearReserva);
router.get("/", verificarToken, listarReservas);

export default router;
