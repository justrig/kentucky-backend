exports.asignarPermiso = async (req, res) => {
  const { usuarioId, permisoId } = req.body;
  await pool.query("INSERT INTO usuario_permisos (usuario_id, permiso_id) VALUES ($1, $2)", [usuarioId, permisoId]);
  res.json({ mensaje: "Permiso asignado correctamente" });
};
