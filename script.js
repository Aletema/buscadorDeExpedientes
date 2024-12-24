// ID de la hoja de Google Sheets y clave de API
const sheetId = "13_N-JkdVvl3Tu5txTu9qR2xXpSVWzhqowhLn-JWUCKc"; // Reemplaza con el ID de tu hoja
const apiKey = "AIzaSyAo_EiLMzVXYd-C0A8-9MzCkrYDBL6bwzI"; // Reemplaza con tu clave de API
const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Hoja1?key=${apiKey}`;

let expedienteData = []; // Almacena los datos cargados desde Google Sheets

// Función para formatear fechas
function formatDate(date) {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return date; // Si no es una fecha válida, devolver como está
  return parsedDate.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// Cargar datos desde Google Sheets
async function loadFromGoogleSheets() {
  try {
    const response = await fetch(sheetUrl);
    if (!response.ok) throw new Error("No se pudo cargar la hoja de cálculo");
    const data = await response.json();
    expedienteData = data.values; // `values` contiene los datos como matriz
    console.log("Datos cargados desde Google Sheets.");
    alert("Datos cargados desde el servidor.");
  } catch (error) {
    console.error("Error al cargar datos desde Google Sheets:", error);
    alert("Error al cargar datos. Verifica la conexión con Google Sheets.");
  }
}

// Buscar expedientes
function searchExpediente() {
  const query = document.getElementById("searchQuery").value.toLowerCase();
  const headers = expedienteData[0]; // Fila 1 contiene los títulos de las columnas
  const rows = expedienteData.slice(1); // Datos reales (desde la fila 2)

  const result = rows.find(row => String(row[9] || "").toLowerCase().includes(query)); // Buscar en columna J (índice 9)

  if (result) {
    showResultModal(result, headers);
  } else {
    alert("No se encontraron resultados.");
  }
}

// Mostrar los resultados en el modal
function showResultModal(row, headers) {
  const fields = [
    { title: "N° PM", index: 0 },
    { title: "Nombre", index: 1 },
    { title: "FECHA PRESENTACION DJP", index: 5, isDate: true },
    { title: "Infracciones", index: 8 },
    { title: "N° de Expediente", index: 9 },
    { title: "Nombre del expediente", index: 10 },
    { title: "Mineral", index: 11 },
    { title: "Vencimiento DJA", index: 14, isDate: true },
    { title: "Titular", index: 16 },
    { title: "Estado legal", index: 17 },
    { title: "Estado del expediente", index: 22 },
  ];

  // Generar contenido del modal
  const content = fields
    .map(field => {
      let value = row[field.index] || "N/A";
      if (field.isDate) value = formatDate(value); // Formatear fechas si es necesario
      return `<p><strong>${headers[field.index]}:</strong> ${value}</p>`;
    })
    .join("");

  // Revisar si "Estado del expediente" contiene "NO"
  const estadoExpediente = String(row[22] || "").toUpperCase(); // Convertir a mayúsculas para evitar problemas de case
  const indicador = estadoExpediente.includes("NO")
    ? `<div class="indicador-no-apto">No apto para trabajar</div>`
    : "";

  document.getElementById("modalContent").innerHTML = content + indicador;
  document.getElementById("modal").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// Cerrar el modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

// Cargar datos automáticamente al inicio
(async function () {
  await loadFromGoogleSheets();
})();
