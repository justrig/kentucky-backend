import express from "express";
import { ventasDiarias, productosMasVendidos, margenGanancia } from "../controllers/reportController.js";
import { verificarToken } from "../middleware/authMiddleware.js";
import { verificarRol } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/ventas-diarias", verificarToken, verificarRol(["admin"]), ventasDiarias);
router.get("/productos-mas-vendidos", verificarToken, productosMasVendidos);
router.get("/margen-ganancia", verificarToken, verificarRol(["admin"]), margenGanancia);

export default router;
