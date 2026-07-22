import express from "express";
import { listarMesas, actualizarEstadoMesa } from "../controllers/tableController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verificarToken, listarMesas);
router.put("/", verificarToken, actualizarEstadoMesa);

export default router;
