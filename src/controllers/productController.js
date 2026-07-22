import { pool } from "../config/db.js";

export const listarProductos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar productos" });
  }
};

export const crearProducto = async (req, res) => {
  const { nombre, precio, categoria } = req.body;
  try {
    await pool.query(
      "INSERT INTO productos (nombre, precio, categoria) VALUES ($1, $2, $3)",
      [nombre, precio, categoria]
    );
    res.status(201).json({ mensaje: "Producto creado con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear producto" });
  }
};
