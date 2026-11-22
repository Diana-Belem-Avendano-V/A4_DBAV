// Microservicio web: Catálogo de autos
// Expone una API REST (JSON) de solo lectura y sirve un frontend HTML/CSS/JS.
const express = require("express");
const path = require("path");
const autos = require("./data/autos");

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir que otros sitios/servicios consuman la API (CORS básico)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Frontend (carpeta public: index.html, style.css, app.js)
app.use(express.static(path.join(__dirname, "public")));

// ---------- Endpoints de la API ----------

// Estado del servicio
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", servicio: "catalogo-autos", total: autos.length });
});

// Listar autos, con filtros opcionales:
//   ?marca=Nissan  ?color=Rojo  ?anio=2024
//   ?precioMin=300000  ?precioMax=500000
//   ?orden=precio|anio|marca  ?dir=asc|desc
app.get("/api/autos", (req, res) => {
  const { marca, color, anio, precioMin, precioMax, orden, dir } = req.query;
  let resultado = [...autos];

  const igual = (a, b) => a.toLowerCase() === String(b).toLowerCase();

  if (marca) resultado = resultado.filter(a => igual(a.marca, marca));
  if (color) resultado = resultado.filter(a => igual(a.color, color));
  if (anio) resultado = resultado.filter(a => a.anio === Number(anio));
  if (precioMin) resultado = resultado.filter(a => a.precio >= Number(precioMin));
  if (precioMax) resultado = resultado.filter(a => a.precio <= Number(precioMax));

  const camposOrden = ["precio", "anio", "marca", "modelo"];
  if (orden) {
    if (!camposOrden.includes(orden)) {
      return res.status(400).json({ error: `orden inválido. Usa: ${camposOrden.join(", ")}` });
    }
    const signo = dir === "desc" ? -1 : 1;
    resultado.sort((a, b) =>
      (typeof a[orden] === "string" ? a[orden].localeCompare(b[orden]) : a[orden] - b[orden]) * signo
    );
  }

  res.json({ total: resultado.length, datos: resultado });
});

// Obtener un auto por id
app.get("/api/autos/:id", (req, res) => {
  const id = Number(req.params.id);
  const auto = autos.find(a => a.id === id);
  if (!auto) return res.status(404).json({ error: `No existe un auto con id ${req.params.id}` });
  res.json(auto);
});

// Rutas de la API no existentes
app.use("/api", (req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Microservicio de autos escuchando en el puerto ${PORT}`);
});
