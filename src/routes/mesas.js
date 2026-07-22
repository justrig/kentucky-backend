const express = require("express");
const router = express.Router();
const mesasController = require("../controllers/mesasController");

router.get("/", mesasController.obtenerMesas);
router.post("/", mesasController.agregarMesaPlaya);

module.exports = router;
