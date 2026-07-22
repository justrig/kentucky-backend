import express from "express";
import { listarProductos, crearProducto } from "../controllers/productController.js";
import { verificarToken } from "../middleware/authMiddleware.js";
import { verificarRol } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", verificarToken, listarProductos);
router.post("/", verificarToken, verificarRol(["admin"]), crearProducto);

export default router;
