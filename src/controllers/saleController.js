import { pool } from "../config/db.js";

export const registrarVenta = async (req, res) => {
  const { producto_id, cantidad, metodo_pago, usuario_id } = req.body;
  try {
    // Obtener precio del producto
    const producto = await pool.query("SELECT precio FROM productos WHERE id = $1", [producto_id]);
    if (producto.rows.length === 0) return res.status(404).json({ mensaje: "Producto no encontrado" });

    const precio = producto.rows[0].precio;
    const total = precio * cantidad;

    // Registrar venta
    await pool.query(
      "INSERT INTO ventas (producto_id, cantidad, total, metodo_pago, usuario_id) VALUES ($1, $2, $3, $4, $5)",
      [producto_id, cantidad, total, metodo_pago, usuario_id]
    );

    // Actualizar inventario
    await pool.query(
      "UPDATE inventario SET cantidad = cantidad - $1 WHERE producto_id = $2",
      [cantidad, producto_id]
    );

    res.status(201).json({ mensaje: "Venta registrada con éxito", total });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar venta" });
  }
};

export const listarVentas = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT v.id, p.nombre, v.cantidad, v.total, v.metodo_pago, v.fecha FROM ventas v JOIN productos p ON v.producto_id = p.id"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar ventas" });
  }
};
