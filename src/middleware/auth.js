
const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { id, rol, nombre }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

function verificarRol(rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ error: "Acceso denegado" });
    }
    next();
  };
}

module.exports = { verificarToken, verificarRol };
