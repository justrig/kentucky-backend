// Inventory.js
export const crearTablaInventario = `
  CREATE TABLE IF NOT EXISTS inventario (
    id SERIAL PRIMARY KEY,
    producto_id INT REFERENCES productos(id),
    cantidad INT NOT NULL,
    ubicacion VARCHAR(50),
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
