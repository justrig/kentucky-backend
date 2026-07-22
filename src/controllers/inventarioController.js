exports.inventarioPorUbicacion = async (req, res) => {
  try {
    const bar = await pool.query("SELECT nombre, stock FROM productos WHERE ubicacion = 'bar'");
    const cocina = await pool.query("SELECT nombre, stock FROM productos WHERE ubicacion = 'cocina'");
    const bodega = await pool.query("SELECT nombre, stock FROM productos WHERE ubicacion = 'bodega'");

    res.json({
      bar: bar.rows,
      cocina: cocina.rows,
      bodega: bodega.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// /backend/src/controllers/inventarioController.js
exports.reabastecerDesdeBodega = async (req, res) => {
  const { productoId, destino, cantidad } = req.body; 
  try {
    // 1. Verificar stock en bodega
    const bodega = await pool.query(
      "SELECT stock FROM productos WHERE id = $1 AND ubicacion = 'bodega'",
      [productoId]
    );

    if (bodega.rows.length === 0 || bodega.rows[0].stock < cantidad) {
      return res.status(400).json({ error: "Stock insuficiente en bodega" });
    }

    // 2. Descontar de bodega
    await pool.query(
      "UPDATE productos SET stock = stock - $1 WHERE id = $2 AND ubicacion = 'bodega'",
      [cantidad, productoId]
    );

    // 3. Sumar al destino (bar o cocina)
    await pool.query(
      "UPDATE productos SET stock = stock + $1 WHERE id = $2 AND ubicacion = $3",
      [cantidad, productoId, destino]
    );

    res.json({ mensaje: `Reabastecido ${cantidad} unidades desde bodega a ${destino}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// /backend/src/controllers/inventarioController.js
exports.historialTraslados = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.id, p.nombre, t.origen, t.destino, t.cantidad, t.usuario, t.fecha
      FROM traslados t
      JOIN productos p ON p.id = t.producto_id
      ORDER BY t.fecha DESC
      LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// /backend/src/controllers/inventarioController.js
exports.historialTrasladosPorFechas = async (req, res) => {
  const { inicio, fin } = req.query; // formato YYYY-MM-DD
  try {
    const result = await pool.query(`
      SELECT t.id, p.nombre, t.origen, t.destino, t.cantidad, t.usuario, t.fecha
      FROM traslados t
      JOIN productos p ON p.id = t.producto_id
      WHERE t.fecha BETWEEN $1 AND $2
      ORDER BY t.fecha DESC
    `, [inicio, fin]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
