// Catálogo básico de autos (fuente de datos del microservicio).
// Cada auto tiene: id, marca, modelo, anio, precio (MXN) y color.
const autos = [
  { id: 1,  marca: "Nissan",     modelo: "Versa",    anio: 2024, precio: 329900, color: "Blanco" },
  { id: 2,  marca: "Nissan",     modelo: "Sentra",   anio: 2023, precio: 419900, color: "Gris" },
  { id: 3,  marca: "Volkswagen", modelo: "Jetta",    anio: 2024, precio: 489900, color: "Negro" },
  { id: 4,  marca: "Volkswagen", modelo: "Virtus",   anio: 2022, precio: 309000, color: "Rojo" },
  { id: 5,  marca: "Chevrolet",  modelo: "Aveo",     anio: 2023, precio: 279900, color: "Azul" },
  { id: 6,  marca: "Toyota",     modelo: "Corolla",  anio: 2025, precio: 459900, color: "Plata" },
  { id: 7,  marca: "Toyota",     modelo: "RAV4",     anio: 2024, precio: 689900, color: "Blanco" },
  { id: 8,  marca: "Honda",      modelo: "Civic",    anio: 2023, precio: 529900, color: "Negro" },
  { id: 9,  marca: "Mazda",      modelo: "Mazda 3",  anio: 2025, precio: 479900, color: "Rojo" },
  { id: 10, marca: "Kia",        modelo: "Rio",      anio: 2022, precio: 289900, color: "Gris" },
  { id: 11, marca: "Hyundai",    modelo: "Tucson",   anio: 2024, precio: 619900, color: "Azul" },
  { id: 12, marca: "Ford",       modelo: "Mustang",  anio: 2021, precio: 899900, color: "Amarillo" }
];

module.exports = autos;
