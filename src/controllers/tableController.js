import { pool } from "../config/db.js";

export const listarMesas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mesas");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar mesas" });
  }
};

export const actualizarEstadoMesa = async (req, res) => {
  const { mesa_id, estado } = req.body;
  try {
    await pool.query("UPDATE mesas SET estado = $1 WHERE id = $2", [estado, mesa_id]);
    res.json({ mensaje: "Estado de mesa actualizado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar mesa" });
  }
};
