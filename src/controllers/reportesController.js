const reportesModel = require("../models/reportesModel");

exports.ventasDiarias = async (req, res) => {
  const { fechaInicio, fechaFin, empleado } = req.query;
  try {
    const data = await reportesModel.getVentasDiarias(fechaInicio, fechaFin, empleado);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.productosMasVendidos = async (req, res) => {
  const { fechaInicio, fechaFin, categoria, empleado } = req.query;
  try {
    const data = await reportesModel.getProductosMasVendidos(fechaInicio, fechaFin, categoria, empleado);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.margenGanancia = async (req, res) => {
  const { fechaInicio, fechaFin, empleado } = req.query;
  try {
    const data = await reportesModel.getMargenGanancia(fechaInicio, fechaFin, empleado);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rendimientoPersonal = async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;
  try {
    const data = await reportesModel.getRendimientoPersonal(fechaInicio, fechaFin);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.historialRanking = async (req, res) => {
  try {
    const data = await reportesModel.getHistorialRanking();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.incentivos = async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;
  try {
    const data = await reportesModel.getIncentivos(fechaInicio, fechaFin);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


if (ventas < promedioVentas * 0.5) {
  enviarNotificacion("Alerta", `⚠️ ${empleado} está por debajo del promedio en ventas.`);
}

exports.resumenEjecutivo = async (req, res) => {
  try {
    const totalVentas = await pool.query("SELECT SUM(total) AS ventas FROM pedidos");
    const totalNotificaciones = await pool.query("SELECT COUNT(*) AS cantidad FROM notificaciones");
    const empleadoDestacado = await pool.query(`
      SELECT empleado, SUM(ventas) AS total
      FROM rendimiento
      GROUP BY empleado
      ORDER BY total DESC
      LIMIT 1
    `);

    res.json({
      ventas: totalVentas.rows[0].ventas || 0,
      notificaciones: totalNotificaciones.rows[0].cantidad || 0,
      destacado: empleadoDestacado.rows[0]?.empleado || "N/A"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resumenEjecutivo = async (req, res) => {
  try {
    const ventasActual = await pool.query("SELECT SUM(total) AS ventas FROM pedidos WHERE fecha >= NOW() - INTERVAL '7 days'");
    const ventasAnterior = await pool.query("SELECT SUM(total) AS ventas FROM pedidos WHERE fecha BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days'");

    const totalNotificaciones = await pool.query("SELECT COUNT(*) AS cantidad FROM notificaciones WHERE fecha >= NOW() - INTERVAL '7 days'");
    const notificacionesAnterior = await pool.query("SELECT COUNT(*) AS cantidad FROM notificaciones WHERE fecha BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days'");

    const empleadoDestacado = await pool.query(`
      SELECT empleado, SUM(ventas) AS total
      FROM rendimiento
      WHERE fecha >= NOW() - INTERVAL '7 days'
      GROUP BY empleado
      ORDER BY total DESC
      LIMIT 1
    `);

    res.json({
      ventas: ventasActual.rows[0].ventas || 0,
      ventasAnterior: ventasAnterior.rows[0].ventas || 0,
      notificaciones: totalNotificaciones.rows[0].cantidad || 0,
      notificacionesAnterior: notificacionesAnterior.rows[0].cantidad || 0,
      destacado: empleadoDestacado.rows[0]?.empleado || "N/A"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.metricasRapidas = async (req, res) => {
  try {
    const pedidosHoy = await pool.query("SELECT COUNT(*) AS cantidad FROM pedidos WHERE DATE(fecha) = CURRENT_DATE");
    const productosAgotados = await pool.query("SELECT COUNT(*) AS cantidad FROM productos WHERE stock = 0");
    const reservasActivas = await pool.query("SELECT COUNT(*) AS cantidad FROM reservas WHERE estado = 'activa'");

    res.json({
      pedidosHoy: pedidosHoy.rows[0].cantidad || 0,
      productosAgotados: productosAgotados.rows[0].cantidad || 0,
      reservasActivas: reservasActivas.rows[0].cantidad || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.metricasGraficos = async (req, res) => {
  try {
    const pedidos = await pool.query(`
      SELECT DATE(fecha) AS dia, COUNT(*) AS cantidad
      FROM pedidos
      WHERE fecha >= NOW() - INTERVAL '7 days'
      GROUP BY dia
      ORDER BY dia ASC
    `);

    const reservas = await pool.query(`
      SELECT DATE(fecha) AS dia, COUNT(*) AS cantidad
      FROM reservas
      WHERE fecha >= NOW() - INTERVAL '7 days' AND estado = 'activa'
      GROUP BY dia
      ORDER BY dia ASC
    `);

    const productos = await pool.query(`
      SELECT DATE(fecha_actualizacion) AS dia, COUNT(*) AS cantidad
      FROM productos
      WHERE stock = 0 AND fecha_actualizacion >= NOW() - INTERVAL '7 days'
      GROUP BY dia
      ORDER BY dia ASC
    `);

    res.json({
      pedidos: pedidos.rows,
      reservas: reservas.rows,
      productos: productos.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.comparativoVentasCompras = async (req, res) => {
  try {
    const ventas = await pool.query(`
      SELECT DATE(fecha) AS dia, SUM(total) AS monto
      FROM pedidos
      WHERE fecha >= NOW() - INTERVAL '7 days'
      GROUP BY dia
      ORDER BY dia ASC
    `);

    const compras = await pool.query(`
      SELECT DATE(fecha) AS dia, SUM(monto) AS monto
      FROM compras
      WHERE fecha >= NOW() - INTERVAL '7 days'
      GROUP BY dia
      ORDER BY dia ASC
    `);

    res.json({
      ventas: ventas.rows,
      compras: compras.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
