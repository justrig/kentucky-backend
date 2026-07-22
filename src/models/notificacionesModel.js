const pool = require("../db");
const { enviarNotificacion } = require("../services/notificacionesService");

exports.guardar = async (tipo, mensaje) => {
  await pool.query(
    "INSERT INTO notificaciones (tipo, mensaje) VALUES ($1, $2)",
    [tipo, mensaje]
  );
  enviarNotificacion(tipo, mensaje); // también lo manda en tiempo real
};

exports.listar = async () => {
  const result = await pool.query("SELECT * FROM notificaciones ORDER BY fecha DESC LIMIT 50");
  return result.rows;
};

exports.listarConFiltros = async ({ tipo, fechaInicio, fechaFin, empleado }) => {
  let query = "SELECT * FROM notificaciones WHERE 1=1";
  const params = [];
  
  if (tipo) {
    params.push(tipo);
    query += ` AND tipo = $${params.length}`;
  }
  if (fechaInicio && fechaFin) {
    params.push(fechaInicio, fechaFin);
    query += ` AND fecha BETWEEN $${params.length-1} AND $${params.length}`;
  }
  if (empleado) {
    params.push(empleado);
    query += ` AND mensaje ILIKE '%' || $${params.length} || '%'`;
  }

  query += " ORDER BY fecha DESC LIMIT 50";
  const result = await pool.query(query, params);
  return result.rows;
};
