// --- Importaciones ---
const express = require("express");
const router = express.Router();
const licoresController = require("../controllers/licoresController");

// --- Rutas principales ---
// Obtener todas las presentaciones de licores
router.get("/", async (req, res) => {
  try {
    const result = await req.app.locals.db.query("SELECT * FROM presentaciones_licor");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar consumo (aplica lógica de prioridad de botellas)
router.post("/:id/consumo", licoresController.registrarConsumo);

// Reabastecer inventario
router.post("/:id/reabastecer", licoresController.reabastecer);

// Registrar relleno de botellas pequeñas desde la grande
router.post("/:id/relleno", licoresController.rellenar);

// Registrar copas de vino (150ml por copa)
router.post("/:id/copa", licoresController.registrarCopa);

module.exports = router;




