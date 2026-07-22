const pool = require("../db/connection");

exports.getReservas = async () => {
  const result = await pool.query(
    `SELECT r.id, r.cliente, r.hora, r.fecha, r.personas, 
            m.numero AS mesaNumero, m.tipo, m.estado
     FROM reservas r
     JOIN mesas m ON r.mesa_id = m.id
     ORDER BY r.fecha, r.hora`
  );
  return result.rows;
};

exports.crearReserva = async (mesaId, cliente, hora, personas) => {
  await pool.query(
    "INSERT INTO reservas (mesa_id, cliente, hora, personas) VALUES ($1, $2, $3, $4)",
    [mesaId, cliente, hora, personas]
  );
  await pool.query("UPDATE mesas SET estado='reservada' WHERE id=$1", [mesaId]);
};

exports.cancelarReserva = async (id) => {
  const mesa = await pool.query("SELECT mesa_id FROM reservas WHERE id=$1", [id]);
  if (mesa.rows.length > 0) {
    await pool.query("UPDATE mesas SET estado='disponible' WHERE id=$1", [mesa.rows[0].mesa_id]);
  }
  await pool.query("DELETE FROM reservas WHERE id=$1", [id]);
};
