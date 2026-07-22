export const crearTablaMesas = `
  CREATE TABLE IF NOT EXISTS mesas (
    id SERIAL PRIMARY KEY,
    numero INT UNIQUE NOT NULL,
    capacidad INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'disponible'
  );
`;
