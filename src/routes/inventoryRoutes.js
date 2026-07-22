import express from "express";
import { listarInventario, actualizarInventario } from "../controllers/inventoryController.js";
import { verificarToken } from "../middleware/authMiddleware.js";
import { verificarRol } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", verificarToken, listarInventario);
router.post("/", verificarToken, verificarRol(["admin", "cajero"]), actualizarInventario);

export default router;
