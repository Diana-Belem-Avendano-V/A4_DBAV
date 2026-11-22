# Microservicio web: Catálogo básico de autos

Microservicio REST que **recupera** un catálogo de autos con los atributos
**marca, modelo, año, precio y color**. Incluye un frontend en HTML, CSS y JS
que consume el servicio.

## 1. Diseño del microservicio

**Responsabilidad única:** exponer (solo lectura) el catálogo de autos.
No maneja usuarios, ventas ni inventario. Esas serían otras funciones
y, por lo tanto, otros microservicios.

### Arquitectura

```
[ Navegador / otro servicio ]
          │  HTTP GET  (JSON)
          ▼
┌───────────────────────────────┐
│  Microservicio catálogo-autos │  Node.js + Express
│  index.js  → rutas /api/...   │
│  data/autos.js → datos        │
└───────────────────────────────┘
```

- **Cliente:** `public/` (index.html, style.css, app.js) hace `fetch` a la API.
- **Capa de API:** `index.js` define los endpoints, los filtros y los errores.
- **Capa de datos:** `data/autos.js` (arreglo en memoria). Se puede cambiar por
  una base de datos sin modificar el contrato de la API.

### Modelo de datos (recurso `Auto`)

| Campo  | Tipo   | Ejemplo    | Descripción               |
|--------|--------|------------|---------------------------|
| id     | número | 3          | Identificador único       |
| marca  | texto  | Volkswagen | Fabricante                |
| modelo | texto  | Jetta      | Nombre del modelo         |
| anio   | número | 2024       | Año del modelo            |
| precio | número | 489900     | Precio en MXN             |
| color  | texto  | Negro      | Color exterior            |

### Endpoints

| Método | Ruta              | Descripción                    | Respuesta          |
|--------|-------------------|--------------------------------|--------------------|
| GET    | `/api/health`     | Estado del servicio            | 200                |
| GET    | `/api/autos`      | Lista el catálogo (con filtros) | 200, 400           |
| GET    | `/api/autos/:id`  | Un auto por id                 | 200, 404           |

**Parámetros opcionales de `/api/autos`:**
`marca`, `color`, `anio`, `precioMin`, `precioMax`,
`orden` (`precio` | `anio` | `marca` | `modelo`), `dir` (`asc` | `desc`).

Ejemplos:

```
GET /api/autos
GET /api/autos?marca=Nissan
GET /api/autos?color=Rojo&orden=precio&dir=desc
GET /api/autos?precioMax=300000
GET /api/autos/7
```

Respuesta de `GET /api/autos?marca=Nissan`:

```json
{
  "total": 2,
  "datos": [
    { "id": 1, "marca": "Nissan", "modelo": "Versa",  "anio": 2024, "precio": 329900, "color": "Blanco" },
    { "id": 2, "marca": "Nissan", "modelo": "Sentra", "anio": 2023, "precio": 419900, "color": "Gris" }
  ]
}
```

Errores (siempre en JSON):

```json
{ "error": "No existe un auto con id 99" }                          // 404
{ "error": "orden inválido. Usa: precio, anio, marca, modelo" }     // 400
```

### Decisiones de diseño

- **REST + JSON:** formato estándar y fácil de consumir desde cualquier lenguaje.
- **Sin estado (stateless):** cada petición es independiente, así el servicio
  puede escalar con más instancias.
- **Solo GET:** el ejercicio pide *recuperar* el catálogo.
- **CORS abierto:** otros sitios o microservicios pueden consumir la API.
- **Puerto por variable de entorno (`PORT`):** necesario en Replit y en la nube.

## 2. Estructura del proyecto

```
microservicio-autos/
├── .vscode/
│   ├── launch.json      # Ejecutar/depurar con F5 en VS Code
│   └── extensions.json  # Extensión recomendada (REST Client)
├── api.http             # Peticiones de prueba a la API
├── index.js             # Servidor y endpoints
├── package.json         # Dependencias (express) y script start
├── data/
│   └── autos.js         # Catálogo
└── public/
    ├── index.html       # Interfaz
    ├── style.css        # Estilos
    └── app.js           # Consumo de la API con fetch
```

## 3. Cómo montarlo en Visual Studio Code

### Requisitos

- **Visual Studio Code**: https://code.visualstudio.com/
- **Node.js LTS** (versión 18 o mayor): https://nodejs.org/
  Para verificarlo, abre una terminal y ejecuta `node -v` y `npm -v`.

### Pasos

1. **Descomprime** `microservicio-autos.zip` (por ejemplo en Documentos).
2. En VS Code: **File → Open Folder…** y selecciona la carpeta `microservicio-autos`.
   Si aparece *"Do you trust the authors?"*, elige **Yes, I trust the authors**.
3. Abre la terminal integrada con **Terminal → New Terminal** (`Ctrl + ñ` o `` Ctrl + ` ``)
   e instala las dependencias (solo la primera vez):
   ```bash
   npm install
   ```
4. **Inicia el microservicio.** Puedes hacerlo de dos formas:
   - **Opción A (terminal):**
     ```bash
     npm start
     ```
   - **Opción B (F5):** ve a **Run and Debug** (`Ctrl + Shift + D`), elige
     **"Iniciar microservicio"** y presiona **F5**. El navegador se abre solo y
     puedes poner *breakpoints* en `index.js`.

   En la terminal debe aparecer:
   `Microservicio de autos escuchando en el puerto 3000`
5. **Revisa el resultado en el navegador:**
   - Interfaz: http://localhost:3000
   - API (JSON): http://localhost:3000/api/autos
   - Filtro: http://localhost:3000/api/autos?marca=Nissan
6. Para **detener** el servidor: `Ctrl + C` en la terminal, o el botón ⏹ si
   usaste F5.

### Problemas comunes

| Problema | Solución |
|----------|----------|
| `npm` o `node` no se reconoce | Instala Node.js y **reinicia VS Code**. |
| En Windows: *"la ejecución de scripts está deshabilitada"* (PowerShell) | Cambia la terminal a **Command Prompt** (flecha ⌄ junto al **+** de la terminal) o ejecuta `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. |
| `Cannot find module 'express'` | No se ejecutó `npm install` dentro de la carpeta del proyecto. |
| `EADDRINUSE: port 3000` | El puerto está ocupado. Cierra el otro servidor o usa otro puerto: en PowerShell `$env:PORT=4000; npm start` y en CMD `set PORT=4000 && npm start`. |