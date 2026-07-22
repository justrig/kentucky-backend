
const verificarPermiso = (permiso) => (req, res, next) => {
  const usuario = req.user; // viene del JWT
  if (usuario.rol === "admin") return next(); // admins todo permitido

  if (permiso === "registrar_consumo" && usuario.rol === "empleado") return next();

  return res.status(403).json({ error: "No tienes permiso para esta acción" });
};
