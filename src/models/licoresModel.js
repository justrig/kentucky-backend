// --- Importaciones ---
const pool = require("../db/connection");

// --- Obtener presentaciones ordenadas (de mayor a menor ml) ---
exports.getPresentacionesOrdenadas = async (licorId) => {
  const result = await pool.query(
    "SELECT * FROM presentaciones_licor WHERE licor_id=$1 ORDER BY ml DESC",
    [licorId]
  );
  return result.rows;
};

// --- Descontar botellas de una presentación ---
exports.descontarBotellas = async (presentacionId, cantidad) => {
  await pool.query(
    "UPDATE presentaciones_licor SET cantidad = cantidad - $1 WHERE id=$2",
    [cantidad, presentacionId]
  );
};

// --- Reabastecer una presentación ---
exports.reabastecerPresentacion = async (licorId, ml, totalBotellas) => {
  await pool.query(
    "UPDATE presentaciones_licor SET cantidad = cantidad + $1 WHERE licor_id=$2 AND ml=$3",
    [totalBotellas, licorId, ml]
  );
};

// --- Obtener la botella grande (ej. 1750ml marcada como principal) ---
exports.getBotellaGrande = async (licorId) => {
  const result = await pool.query(
    "SELECT * FROM presentaciones_licor WHERE licor_id=$1 AND es_principal=true LIMIT 1",
    [licorId]
  );
  return result.rows[0];
};



const { enviarNotificacion } = require("../services/notificacionesService");

exports.actualizarStock = async (productoId, cantidad) => {
  const result = await pool.query(
    "UPDATE licores SET stock = stock - $1 WHERE id = $2 RETURNING stock, nombre",
    [cantidad, productoId]
  );

  const { stock, nombre } = result.rows[0];
  if (stock < 10) {
    enviarNotificacion("Stock", `📦 El producto ${nombre} está en nivel crítico (${stock} unidades).`);
  }
  return result.rows[0];
};
