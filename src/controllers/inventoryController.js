import { pool } from "../config/db.js";

export const listarInventario = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT i.id, p.nombre, i.cantidad, i.ubicacion FROM inventario i JOIN productos p ON i.producto_id = p.id"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar inventario" });
  }
};

export const actualizarInventario = async (req, res) => {
  const { producto_id, cantidad, ubicacion } = req.body;
  try {
    await pool.query(
      "INSERT INTO inventario (producto_id, cantidad, ubicacion) VALUES ($1, $2, $3) ON CONFLICT (producto_id) DO UPDATE SET cantidad = $2, ubicacion = $3, actualizado = CURRENT_TIMESTAMP",
      [producto_id, cantidad, ubicacion]
    );
    res.json({ mensaje: "Inventario actualizado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar inventario" });
  }
};
