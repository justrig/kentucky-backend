// Product.js
export const crearTablaProductos = `
  CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    categoria VARCHAR(50),
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
