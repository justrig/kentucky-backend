// /backend/src/middleware/verificarRol.js
module.exports = function (rolesPermitidos) {
  return (req, res, next) => {
    const usuario = req.user; // viene del JWT (ya lo tienes en tu middleware de autenticación)
    if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({ error: "Acceso denegado" });
    }
    next();
  };
};
