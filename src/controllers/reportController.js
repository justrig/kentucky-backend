import { pool } from "../config/db.js";

// Ventas diarias
export const ventasDiarias = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DATE(fecha) AS dia, SUM(total) AS total_dia
      FROM ventas
      GROUP BY DATE(fecha)
      ORDER BY dia DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener ventas diarias" });
  }
};

// Productos más vendidos
export const productosMasVendidos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.nombre, SUM(v.cantidad) AS total_vendido
      FROM ventas v
      JOIN productos p ON v.producto_id = p.id
      GROUP BY p.nombre
      ORDER BY total_vendido DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos más vendidos" });
  }
};

// Margen de ganancia (ejemplo simple)
export const margenGanancia = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT SUM(total) AS ingresos, SUM(cantidad * p.precio) AS costos
      FROM ventas v
      JOIN productos p ON v.producto_id = p.id
    `);
    const { ingresos, costos } = result.rows[0];
    const ganancia = ingresos - costos;
    res.json({ ingresos, costos, ganancia });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al calcular margen de ganancia" });
  }
};
