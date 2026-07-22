// Sale.js
export const crearTablaVentas = `
  CREATE TABLE IF NOT EXISTS ventas (
    id SERIAL PRIMARY KEY,
    producto_id INT REFERENCES productos(id),
    cantidad INT NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    metodo_pago VARCHAR(50),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT REFERENCES usuarios(id)
  );
`;
