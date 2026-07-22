import express from "express";
import { registrarVenta, listarVentas } from "../controllers/saleController.js";
import { verificarToken } from "../middleware/authMiddleware.js";
import { verificarRol } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", verificarToken, verificarRol(["admin", "cajero"]), registrarVenta);
router.get("/", verificarToken, listarVentas);

export default router;
