const mesasModel = require("../models/mesasModel");

exports.obtenerMesas = async (req, res) => {
  try {
    const mesas = await mesasModel.getMesas();
    res.json(mesas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.agregarMesaPlaya = async (req, res) => {
  try {
    await mesasModel.agregarMesaPlaya();
    res.json({ message: "Mesa en playa agregada correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
