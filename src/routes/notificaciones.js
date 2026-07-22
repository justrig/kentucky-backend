const express = require("express");
const router = express.Router();
const notificacionesController = require("../controllers/notificacionesController");
const verificarRol = require("../middleware/verificarRol");

router.get("/", verificarRol(["admin"]), notificacionesController.listar);
router.get("/estadisticas", verificarRol(["admin"]), notificacionesController.estadisticas);


module.exports = router;


