const pool = require("../db/connection");

exports.getMesas = async () => {
  const result = await pool.query("SELECT * FROM mesas ORDER BY numero");
  return result.rows;
};

exports.agregarMesaPlaya = async () => {
  await pool.query(
    "INSERT INTO mesas (tipo, estado) VALUES ($1, $2)",
    ["playa", "disponible"]
  );
};
