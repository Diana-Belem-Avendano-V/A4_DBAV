// Cliente del microservicio: consume /api/autos con fetch y pinta la tabla.
const API = "/api/autos";

const $ = id => document.getElementById(id);
const formatoPrecio = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

async function cargarOpciones() {
  const res = await fetch(API);
  const { datos } = await res.json();
  const unicos = campo => [...new Set(datos.map(a => a[campo]))].sort();
  unicos("marca").forEach(m => $("marca").add(new Option(m, m)));
  unicos("color").forEach(c => $("color").add(new Option(c, c)));
}

async function buscar() {
  const params = new URLSearchParams();
  ["marca", "color", "precioMax", "orden", "dir"].forEach(campo => {
    const valor = $(campo).value;
    if (valor) params.append(campo, valor);
  });
  if (!$("orden").value) params.delete("dir");

  const url = params.toString() ? `${API}?${params}` : API;
  $("estado").textContent = "Cargando…";

  try {
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);

    $("tabla").innerHTML = json.datos.map(a => `
      <tr>
        <td>${a.marca}</td>
        <td>${a.modelo}</td>
        <td>${a.anio}</td>
        <td>${formatoPrecio.format(a.precio)}</td>
        <td>${a.color}</td>
      </tr>`).join("");

    $("estado").textContent = `${json.total} auto(s) encontrados — GET ${url}`;
  } catch (err) {
    $("tabla").innerHTML = "";
    $("estado").textContent = `Error: ${err.message}`;
  }
}

$("filtros").addEventListener("submit", e => { e.preventDefault(); buscar(); });

cargarOpciones().then(buscar);
