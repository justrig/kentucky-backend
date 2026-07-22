import { pool } from "../config/db.js";

export const crearReserva = async (req, res) => {
  const { mesa_id, cliente, fecha } = req.body;
  try {
    await pool.query(
      "INSERT INTO reservas (mesa_id, cliente, fecha) VALUES ($1, $2, $3)",
      [mesa_id, cliente, fecha]
    );
    await pool.query("UPDATE mesas SET estado = 'reservada' WHERE id = $1", [mesa_id]);
    res.status(201).json({ mensaje: "Reserva creada con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear reserva" });
  }
};

export const listarReservas = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT r.id, m.numero, r.cliente, r.fecha, r.estado FROM reservas r JOIN mesas m ON r.mesa_id = m.id"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar reservas" });
  }
};
