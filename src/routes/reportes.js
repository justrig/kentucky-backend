
const express = require("express");
const router = express.Router();
const reportesController = require("../controllers/reportesController");
const { verificarRol } = require("../middleware/auth");

// Endpoints generales
router.get("/ventas-diarias", reportesController.ventasDiarias);
router.get("/productos-mas-vendidos", reportesController.productosMasVendidos);
router.get("/margen-ganancia", reportesController.margenGanancia);
router.get("/rendimiento-personal", reportesController.rendimientoPersonal);
router.get("/historial-ranking", reportesController.historialRanking);
router.get("/incentivos", reportesController.incentivos);

// Endpoints exclusivos para ADMIN
router.get("/resumen", verificarRol(["admin"]), reportesController.resumenEjecutivo);
router.get("/metricas", verificarRol(["admin"]), reportesController.metricasRapidas);
router.get("/metricas/graficos", verificarRol(["admin"]), reportesController.metricasGraficos);
router.get("/comparativo", verificarRol(["admin"]), reportesController.comparativoVentasCompras);

module.exports = router;
