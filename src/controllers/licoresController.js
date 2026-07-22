// --- Importaciones ---
const db = require("../models/licoresModel");

// --- Registrar Consumo (prioridad de botellas grandes a pequeñas) ---
exports.registrarConsumo = async (req, res) => {
  const { cantidad } = req.body; // ml a descontar
  const licorId = req.params.id;

  try {
    const presentaciones = await db.getPresentacionesOrdenadas(licorId);
    let restante = cantidad;

    for (let p of presentaciones) {
      if (p.cantidad > 0) {
        let mlDisponible = p.cantidad * p.ml;

        if (mlDisponible >= restante) {
          let botellasUsadas = Math.ceil(restante / p.ml);
          await db.descontarBotellas(p.id, botellasUsadas);
          restante = 0;
          break;
        } else {
          await db.descontarBotellas(p.id, p.cantidad);
          restante -= mlDisponible;
        }
      }
    }

    if (restante > 0) {
      return res.status(400).json({ message: "No hay suficiente stock." });
    }

    res.json({ message: "Consumo registrado correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Reabastecer ---
exports.reabastecer = async (req, res) => {
  const { presentacion, totalBotellas } = req.body;
  const licorId = req.params.id;

  try {
    await db.reabastecerPresentacion(licorId, presentacion, totalBotellas);
    res.json({ message: "Reabastecimiento registrado correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Rellenar botellas pequeñas desde la grande ---
exports.rellenar = async (req, res) => {
  const { cantidadBotellas, presentacion } = req.body;
  const licorId = req.params.id;

  try {
    // Buscar la botella grande (ej. 1750ml)
    const grande = await db.getBotellaGrande(licorId);
    if (!grande || grande.cantidad === 0) {
      return res.status(400).json({ message: "No hay botellas grandes disponibles para rellenar." });
    }

    const mlNecesarios = cantidadBotellas * presentacion;

    // Descontar de la botella grande
    let mlDisponible = grande.cantidad * grande.ml;
    if (mlDisponible < mlNecesarios) {
      return res.status(400).json({ message: "No hay suficiente volumen en la botella grande." });
    }

    let botellasUsadas = Math.ceil(mlNecesarios / grande.ml);
    await db.descontarBotellas(grande.id, botellasUsadas);

    // Sumar a la presentación pequeña
    await db.reabastecerPresentacion(licorId, presentacion, cantidadBotellas);

    res.json({ message: "Relleno registrado correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Registrar copas de vino ---
exports.registrarCopa = async (req, res) => {
  const { cantidadCopas, mlPorCopa } = req.body;
  const licorId = req.params.id;

  try {
    const presentaciones = await db.getPresentacionesOrdenadas(licorId);
    let restante = cantidadCopas * mlPorCopa;

    for (let p of presentaciones) {
      if (p.cantidad > 0) {
        let mlDisponible = p.cantidad * p.ml;

        if (mlDisponible >= restante) {
          let botellasUsadas = Math.ceil(restante / p.ml);
          await db.descontarBotellas(p.id, botellasUsadas);
          restante = 0;
          break;
        } else {
          await db.descontarBotellas(p.id, p.cantidad);
          restante -= mlDisponible;
        }
      }
    }

    if (restante > 0) {
      return res.status(400).json({ message: "No hay suficiente vino para cubrir las copas." });
    }

    res.json({ message: "Copas registradas correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
