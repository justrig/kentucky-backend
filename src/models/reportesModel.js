const pool = require("../db/connection");

// --- Ventas diarias con rango de fechas y empleado ---
exports.getVentasDiarias = async (fechaInicio, fechaFin, empleado) => {
  let query = `
    SELECT TO_CHAR(fecha, 'Dy') AS dia, SUM(cantidad_ml * 0.05) AS total_dia
    FROM ventas v
    WHERE v.fecha BETWEEN $1 AND $2
  `;
  const params = [fechaInicio, fechaFin];

  if (empleado && empleado !== "Todos") {
    query += " AND v.usuario_id = (SELECT id FROM usuarios WHERE nombre=$3)";
    params.push(empleado);
  }

  query += " GROUP BY dia ORDER BY MIN(fecha)";

  const result = await pool.query(query, params);
  return result.rows;
};

// --- Productos más vendidos con categoría y empleado ---
exports.getProductosMasVendidos = async (fechaInicio, fechaFin, categoria, empleado) => {
  let query = `
    SELECT l.nombre, SUM(v.cantidad_ml) AS total_vendido
    FROM ventas v
    JOIN licores l ON v.licor_id = l.id
    WHERE v.fecha BETWEEN $1 AND $2
  `;
  const params = [fechaInicio, fechaFin];

  if (categoria && categoria !== "Todas") {
    query += " AND l.categoria = $3";
    params.push(categoria);
  }

  if (empleado && empleado !== "Todos") {
    query += params.length === 2 ? " AND v.usuario_id = (SELECT id FROM usuarios WHERE nombre=$3)" : " AND v.usuario_id = (SELECT id FROM usuarios WHERE nombre=$4)";
    params.push(empleado);
  }

  query += " GROUP BY l.nombre ORDER BY total_vendido DESC LIMIT 5";

  const result = await pool.query(query, params);
  return result.rows;
};

// --- Margen de ganancia con rango de fechas y empleado ---
exports.getMargenGanancia = async (fechaInicio, fechaFin, empleado) => {
  let query = `
    SELECT SUM(v.cantidad_ml * 0.05) AS ingresos,
           SUM(v.cantidad_ml * 0.02) AS costos,
           SUM(v.cantidad_ml * 0.03) AS ganancia
    FROM ventas v
    WHERE v.fecha BETWEEN $1 AND $2
  `;
  const params = [fechaInicio, fechaFin];

  if (empleado && empleado !== "Todos") {
    query += " AND v.usuario_id = (SELECT id FROM usuarios WHERE nombre=$3)";
    params.push(empleado);
  }

  const result = await pool.query(query, params);
  return result.rows[0];
};

// --- Rendimiento del personal ---
exports.getRendimientoPersonal = async (fechaInicio, fechaFin) => {
  const result = await pool.query(`
    SELECT u.nombre AS empleado,
           COUNT(v.id) AS pedidos,
           SUM(v.cantidad_ml * 0.05) AS ventas,
           ROUND(SUM(v.cantidad_ml * 0.05) / NULLIF(COUNT(v.id),0), 2) AS ticket_promedio
    FROM ventas v
    JOIN usuarios u ON v.usuario_id = u.id
    WHERE v.fecha BETWEEN $1 AND $2
    GROUP BY u.nombre
    ORDER BY ventas DESC
  `, [fechaInicio, fechaFin]);
  return result.rows;
};
exports.getHistorialRanking = async () => {
  const result = await pool.query(`
    SELECT u.nombre AS empleado,
           DATE_TRUNC('week', v.fecha) AS semana,
           SUM(v.cantidad_ml * 0.05) AS ventas
    FROM ventas v
    JOIN usuarios u ON v.usuario_id = u.id
    GROUP BY u.nombre, semana
    ORDER BY semana ASC, ventas DESC
  `);
  return result.rows;
};

exports.getIncentivos = async (fechaInicio, fechaFin) => {
  const result = await pool.query(`
    SELECT u.nombre AS empleado,
           SUM(v.cantidad_ml * 0.05) AS ventas,
           COUNT(v.id) AS pedidos,
           ROUND(SUM(v.cantidad_ml * 0.05) / NULLIF(COUNT(v.id),0), 2) AS ticket_promedio,
           CASE 
             WHEN SUM(v.cantidad_ml * 0.05) > 500 THEN 'Bono por ventas'
             WHEN ROUND(SUM(v.cantidad_ml * 0.05) / NULLIF(COUNT(v.id),0), 2) > 30 THEN 'Reconocimiento ticket alto'
             ELSE 'Sin incentivo'
           END AS incentivo
    FROM ventas v
    JOIN usuarios u ON v.usuario_id = u.id
    WHERE v.fecha BETWEEN $1 AND $2
    GROUP BY u.nombre
    ORDER BY ventas DESC
  `, [fechaInicio, fechaFin]);
  return result.rows;
};


if (ventas > 500) {
  enviarNotificacion("Incentivo", `🎉 ${empleado} obtuvo bono por superar $500 en ventas.`);
}
