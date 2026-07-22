import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const registrarUsuario = async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4)",
      [nombre, email, hashedPassword, rol]
    );
    res.status(201).json({ mensaje: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar usuario" });
  }
};

export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const usuario = result.rows[0];
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(401).json({ mensaje: "Credenciales inválidas" });

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
};
