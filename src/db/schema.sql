-- --- Tabla principal de licores ---
CREATE TABLE licores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50),       -- ej. ron, vodka, vino
  precio DECIMAL(10,2) DEFAULT 0,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --- Tabla de presentaciones de cada licor ---
CREATE TABLE presentaciones_licor (
  id SERIAL PRIMARY KEY,
  licor_id INT REFERENCES licores(id) ON DELETE CASCADE,
  ml INT NOT NULL,
  cantidad INT NOT NULL,
  es_principal BOOLEAN DEFAULT FALSE,
  stock_critico INT DEFAULT 0,
  fecha_expiracion DATE,       -- NUEVO: fecha de vencimiento del lote
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --- Tabla de usuarios ---
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(50) DEFAULT 'bartender',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --- Tabla de ventas ---
CREATE TABLE ventas (
  id SERIAL PRIMARY KEY,
  licor_id INT REFERENCES licores(id),
  cantidad_ml INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  usuario_id INT REFERENCES usuarios(id)
);

-- --- Tabla de productos generales ---
CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL, -- licor, cerveza, gaseosa, jugo, smoothie, comida
  precio DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  stock_critico INT DEFAULT 0,
  fecha_expiracion DATE,          -- NUEVO: fecha de vencimiento
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --- Tabla de compras ---
CREATE TABLE compras (
  id SERIAL PRIMARY KEY,
  producto_id INT REFERENCES productos(id),
  cantidad INT NOT NULL,
  costo_unitario DECIMAL(10,2) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  proveedor VARCHAR(100),
  fecha_expiracion DATE           -- NUEVO: fecha de vencimiento del lote comprado
);

-- --- Tabla de recetas ---
CREATE TABLE recetas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL, -- coctel, smoothie, comida
  precio DECIMAL(10,2) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --- Detalle de recetas ---
CREATE TABLE receta_detalle (
  id SERIAL PRIMARY KEY,
  receta_id INT REFERENCES recetas(id) ON DELETE CASCADE,
  producto_id INT REFERENCES productos(id) ON DELETE CASCADE,
  cantidad DECIMAL(10,2) NOT NULL,
  unidad VARCHAR(20) NOT NULL      -- ml, gr, unidad
);

-- --- Tabla de mesas ---
CREATE TABLE mesas (
  id SERIAL PRIMARY KEY,
  numero INT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'interior',
  estado VARCHAR(20) DEFAULT 'disponible'
);

-- --- Tabla de reservas ---
CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  cliente VARCHAR(100) NOT NULL,
  mesa_id INT REFERENCES mesas(id) ON DELETE CASCADE,
  fecha DATE DEFAULT CURRENT_DATE,
  hora TIME NOT NULL,
  personas INT DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --- Tabla de notificaciones ---
CREATE TABLE notificaciones (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50),
  mensaje TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --- Tabla de traslados ---
CREATE TABLE traslados (
  id SERIAL PRIMARY KEY,
  producto_id INT REFERENCES productos(id),
  origen VARCHAR(50),
  destino VARCHAR(50),
  cantidad INT,
  usuario VARCHAR(100),
  fecha TIMESTAMP DEFAULT NOW()
);

-- --- Roles y permisos ---
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE
);

CREATE TABLE permisos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE
);

CREATE TABLE rol_permisos (
  rol_id INT REFERENCES roles(id),
  permiso_id INT REFERENCES permisos(id),
  PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE usuario_roles (
  usuario_id INT REFERENCES usuarios(id),
  rol_id INT REFERENCES roles(id),
  PRIMARY KEY (usuario_id, rol_id)
);

-- --- Tabla de mermas (NUEVA) ---
CREATE TABLE mermas (
  id SERIAL PRIMARY KEY,
  producto_id INT REFERENCES productos(id),
  cantidad INT NOT NULL,
  motivo VARCHAR(50) CHECK (motivo IN ('expiracion','daño','otro')),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  usuario_id INT REFERENCES usuarios(id)
);

-- --- Datos iniciales ---
INSERT INTO roles (nombre) VALUES ('admin'), ('empleado');
INSERT INTO usuario_roles (usuario_id, rol_id) VALUES (1, 1), (2, 1);


-- Función para descontar stock en tiempo real
CREATE OR REPLACE FUNCTION descontar_stock_receta()
RETURNS TRIGGER AS $$
BEGIN
  -- Caso: venta de receta
  IF NEW.receta_id IS NOT NULL THEN
    UPDATE productos
    SET stock = stock - rd.cantidad
    FROM receta_detalle rd
    WHERE rd.receta_id = NEW.receta_id
      AND productos.id = rd.producto_id;
  END IF;

  -- Caso: venta de producto directo
  IF NEW.producto_id IS NOT NULL THEN
    UPDATE productos
    SET stock = stock - NEW.cantidad
    WHERE productos.id = NEW.producto_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que se ejecuta después de cada inserción en ventas_detalle
CREATE TRIGGER trg_descontar_stock
AFTER INSERT ON ventas_detalle
FOR EACH ROW
EXECUTE FUNCTION descontar_stock_receta();


-- Función para registrar mermas automáticamente
CREATE OR REPLACE FUNCTION registrar_merma()
RETURNS TRIGGER AS $$
BEGIN
  -- Caso: producto vencido
  IF NEW.fecha_expiracion IS NOT NULL AND NEW.fecha_expiracion < CURRENT_DATE THEN
    INSERT INTO mermas (producto_id, cantidad, motivo, usuario_id)
    VALUES (NEW.id, NEW.stock, 'expiracion', NULL);
  END IF;

  -- Caso: stock llega a cero
  IF NEW.stock = 0 THEN
    INSERT INTO mermas (producto_id, cantidad, motivo, usuario_id)
    VALUES (NEW.id, 0, 'daño', NULL);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que se ejecuta después de cada actualización en productos
CREATE TRIGGER trg_registrar_merma
AFTER UPDATE ON productos
FOR EACH ROW
EXECUTE FUNCTION registrar_merma();


-- Receta Mojito
INSERT INTO recetas (nombre, categoria, precio)
VALUES ('Mojito', 'coctel', 120);

-- Detalle de Mojito
INSERT INTO receta_detalle (receta_id, producto_id, cantidad, unidad)
VALUES
(1, 1, 50, 'ml'),   -- Ron Flor de Caña
(1, 2, 30, 'ml'),   -- Jugo de limón
(1, 3, 200, 'ml'),  -- Soda
(1, 4, 10, 'gr');   -- Hierbabuena

-- Receta Smoothie de Fresa
INSERT INTO recetas (nombre, categoria, precio)
VALUES ('Smoothie de Fresa', 'smoothie', 90);

-- Detalle de Smoothie de Fresa
INSERT INTO receta_detalle (receta_id, producto_id, cantidad, unidad)
VALUES
(2, 5, 150, 'gr'),  -- Fresas
(2, 6, 200, 'ml'),  -- Yogurt
(2, 7, 50, 'ml');   -- Leche

-- Receta Hamburguesa
INSERT INTO recetas (nombre, categoria, precio)
VALUES ('Hamburguesa Clásica', 'comida', 150);

-- Detalle de Hamburguesa
INSERT INTO receta_detalle (receta_id, producto_id, cantidad, unidad)
VALUES
(3, 8, 1, 'unidad'),   -- Pan de hamburguesa
(3, 9, 150, 'gr'),     -- Carne de res
(3, 10, 20, 'gr'),     -- Queso
(3, 11, 30, 'gr'),     -- Lechuga
(3, 12, 20, 'gr');     -- Tomate
