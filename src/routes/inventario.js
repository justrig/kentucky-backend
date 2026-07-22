import express from "express";
import { listarInventario, actualizarInventario } from "../controllers/inventoryController.js";
import { verificarToken } from "../middleware/authMiddleware.js";
import { verificarRol } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", verificarToken, listarInventario);
router.post("/", verificarToken, verificarRol(["admin", "cajero"]), actualizarInventario);
router.get("/por-ubicacion", verificarRol(["admin"]), inventarioController.inventarioPorUbicacion);
router.post("/reabastecer", verificarRol(["admin"]), inventarioController.reabastecerDesdeBodega);
router.get("/traslados", verificarRol(["admin"]), inventarioController.historialTraslados);
router.get("/traslados/filtrar", verificarRol(["admin"]), inventarioController.historialTrasladosPorFechas);
router.post("/reabastecer", verificarPermiso("reabastecer_inventario"), inventarioController.reabastecerDesdeBodega);
router.post("/consumo", verificarPermiso("registrar_consumo"), inventarioController.registrarConsumo);


export default router;
