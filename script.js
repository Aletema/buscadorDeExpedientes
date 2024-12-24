// Variable global para almacenar los datos del expediente
let expedienteData = [];

// ID de la hoja de Google Sheets y clave de API
const apiKey = "AIzaSyAo_EiLMzVXYd-C0A8-9MzCkrYDBL6bwzI"; // Sustituye con tu API Key válida
const sheetId = "13_N-JkdVvl3Tu5txTu9qR2xXpSVWzhqowhLn-JWUCKc"; // Asegúrate de que este ID sea correcto
const range = "RegistroProvincialdePM"; // Asegúrate de que el nombre de la hoja es correcto

// Función para cargar datos desde Google Sheets
async function loadFromGoogleSheets() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("No se pudo cargar la hoja de cálculo");
        }
        const data = await response.json();
        console.log("Datos cargados desde Google Sheets:", data);
        expedienteData = data.values || []; // Asignar los datos a la variable global
    } catch (error) {
        console.error("Error al cargar datos desde Google Sheets:", error);
        expedienteData = []; // Asegurar que la variable tenga un valor incluso si ocurre un error
    }
}

// Buscar expedientes
function searchExpediente() {
  const query = document.getElementById("searchQuery").value.toLowerCase();

  if (!query.trim()) {
      // Mostrar alerta si no se ha ingresado un número de expediente
      Swal.fire({
          title: "Error",
          text: "Por favor, agrega un número de expediente.",
          icon: "warning",
          confirmButtonText: "Aceptar"
      });
      return;
  }

  const headers = expedienteData[1]; // Fila 1 contiene los títulos de las columnas
  const rows = expedienteData.slice(2); // Datos reales (desde la fila 2)

  // Buscar en la columna J (índice 9)
  const result = rows.find(row => String(row[9] || "").toLowerCase().includes(query));

  if (result) {
      showResultModal(result, headers);
  } else {
      // Mostrar alerta si no se encuentran resultados
      Swal.fire({
          title: "Sin resultados",
          text: "No se encontraron resultados para el número de expediente ingresado.",
          icon: "info",
          confirmButtonText: "Aceptar"
      });
  }
}

// Función para mostrar resultados en el modal
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

  // Revisar el "Estado del expediente" y generar el indicador dinámico
  const estadoExpediente = String(row[22] || "").toUpperCase(); // Convertir a mayúsculas para evitar problemas de case
  let indicador = "";

  if (estadoExpediente.includes("NO")) {
      indicador = `<div class="indicador-no-apto" style="background-color: red; color: white; padding: 10px; text-align: center; margin-top: 10px;">
                      ${estadoExpediente}
                   </div>`;
  } else if (estadoExpediente.includes("OK")) {
      indicador = `<div class="indicador-apto" style="background-color: green; color: white; padding: 10px; text-align: center; margin-top: 10px;">
                      ${estadoExpediente}
                   </div>`;
  }

  document.getElementById("modalContent").innerHTML = content + indicador;
  document.getElementById("modal").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// Función para formatear fechas
function formatDate(date) {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return date; // Si no es una fecha válida, devolver como está
  return parsedDate.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// Función para cerrar el modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

// Cargar datos automáticamente al inicio
(async function () {
  await loadFromGoogleSheets();
  if (expedienteData.length) {
      console.log("Datos cargados correctamente.");
  } else {
      console.log("No se encontraron datos.");
  }
})();

