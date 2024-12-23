let expedienteData = []; // Almacena los datos cargados del Excel
const dbName = "expedienteDB";
const storeName = "expedientes";

// Inicializar IndexedDB
function initDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

// Guardar datos en IndexedDB
async function saveToDatabase(data) {
  const db = await initDatabase();
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);

  store.put(data, "excelData");

  return new Promise((resolve, reject) => {
    transaction.oncomplete = resolve;
    transaction.onerror = reject;
  });
}

// Leer datos desde IndexedDB
async function loadFromDatabase() {
  const db = await initDatabase();
  const transaction = db.transaction(storeName, "readonly");
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.get("excelData");
    request.onsuccess = function () {
      resolve(request.result || []);
    };
    request.onerror = reject;
  });
}

// Manejar la carga del archivo Excel
document.getElementById("fileInput").addEventListener("change", async function (event) {
  const file = event.target.files[0];
  if (!file) {
    alert("Por favor, selecciona un archivo.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    expedienteData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }); // Leer como matriz

    await saveToDatabase(expedienteData); // Guardar en IndexedDB
    alert("Archivo cargado y guardado exitosamente.");
  };
  reader.readAsArrayBuffer(file);
});

// Función para formatear fechas
function formatDate(date) {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return date; // Si no es una fecha válida, devolver como está
  return parsedDate.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// Buscar expedientes
async function searchExpediente() {
  if (!expedienteData.length) {
    expedienteData = await loadFromDatabase(); // Cargar datos desde IndexedDB si no están cargados
    if (!expedienteData.length) {
      alert("Primero carga un archivo Excel.");
      return;
    }
  }

  const query = document.getElementById("searchQuery").value.toLowerCase();
  const headers = expedienteData[1]; // Fila 2 contiene los títulos de las columnas
  const rows = expedienteData.slice(2); // Datos reales (desde la fila 3)

  const result = rows.find(row => String(row[9]).toLowerCase().includes(query)); // Buscar en columna J (índice 9)

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
  expedienteData = await loadFromDatabase();
  if (expedienteData.length) {
    alert("Datos cargados desde el almacenamiento local.");
  }
})();
