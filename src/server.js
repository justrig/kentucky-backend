const express = require("express");
const app = express();
const pool = require("./db/connection");

const licoresRoutes = require("./routes/licores");
const mesasRoutes = require("./routes/mesas");
const reservasRoutes = require("./routes/reservas");
const reportesRoutes = require("./routes/reportes");

app.use(express.json());
app.locals.db = pool;

app.use("/api/licores", licoresRoutes);
app.use("/api/mesas", mesasRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/reportes", reportesRoutes);

app.listen(4000, () => console.log("Servidor POS corriendo en puerto 4000"));


const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Middleware para roles
io.use((socket, next) => {
  const usuario = socket.handshake.auth.usuario; // viene del frontend
  if (!usuario || usuario.rol !== "admin") {
    return next(new Error("Acceso denegado"));
  }
  next();
});

// Evento de conexión
io.on("connection", (socket) => {
  console.log("Administrador conectado a notificaciones");

  // Ejemplo: enviar notificación de stock bajo
  socket.emit("notificacion", {
    tipo: "Stock",
    mensaje: "📦 El Ron Flor de Caña está en nivel crítico."
  });

  // Ejemplo: enviar incentivo
  socket.emit("notificacion", {
    tipo: "Incentivo",
    mensaje: "🎉 Carlos obtuvo bono por ventas altas."
  });
});

server.listen(4000, () => console.log("Servidor POS corriendo en puerto 4000"));





const { Server } = require("socket.io");
const { init } = require("./services/notificacionesService");

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Solo admin puede conectarse
io.use((socket, next) => {
  const usuario = socket.handshake.auth.usuario;
  if (!usuario || usuario.rol !== "admin") {
    return next(new Error("Acceso denegado"));
  }
  next();
});

io.on("connection", (socket) => {
  console.log("Administrador conectado a notificaciones");
});

init(io);
