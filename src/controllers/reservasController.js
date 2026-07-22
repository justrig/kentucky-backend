const reservasModel = require("../models/reservasModel");

exports.obtenerReservas = async (req, res) => {
  try {
    const reservas = await reservasModel.getReservas();
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crearReserva = async (req, res) => {
  const { mesaId, cliente, hora, personas } = req.body;
  try {
    await reservasModel.crearReserva(mesaId, cliente, hora, personas);
    res.json({ message: "Reserva creada correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelarReserva = async (req, res) => {
  const { id } = req.params;
  try {
    await reservasModel.cancelarReserva(id);
    res.json({ message: "Reserva cancelada correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
