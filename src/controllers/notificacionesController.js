

const notificacionesModel = require("../models/notificacionesModel");

exports.listar = async (req, res) => {
  try {
    const data = await notificacionesModel.listar();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listar = async (req, res) => {
  const { tipo, fechaInicio, fechaFin, empleado } = req.query;
  try {
    const data = await notificacionesModel.listarConFiltros({ tipo, fechaInicio, fechaFin, empleado });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.estadisticas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tipo, COUNT(*) AS cantidad
      FROM notificaciones
      GROUP BY tipo
    `);

    const porSemana = await pool.query(`
      SELECT DATE_TRUNC('week', fecha) AS semana, COUNT(*) AS cantidad
      FROM notificaciones
      GROUP BY semana
      ORDER BY semana DESC
      LIMIT 8
    `);

    res.json({ porTipo: result.rows, porSemana: porSemana.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
