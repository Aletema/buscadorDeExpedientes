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
    alert("Por favor, selecciona un archivo válido.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      expedienteData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      await saveToDatabase(expedienteData); // Guardar en IndexedDB
      alert("Archivo cargado exitosamente.");
    } catch (error) {
      console.error("Error al procesar el archivo:", error);
      alert("Error al cargar el archivo. Verifica el formato.");
    }
  };
  reader.readAsArrayBuffer(file);
});

// Formatear fechas
function formatDate(date) {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return date; // Si no es una fecha válida, devolver como está
  return parsedDate.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// Buscar expedientes
function searchExpediente() {
  const query = document.getElementById("searchQuery").value.toLowerCase();
  if (!expedienteData || expedienteData.length < 3) {
    alert("No hay datos cargados. Por favor, sube un archivo.");
    return;
  }

  const headers = expedienteData[1]; // Fila 2 contiene los títulos de las columnas
  const rows = expedienteData.slice(2); // Datos reales (desde la fila 3)
  const result = rows.find(row => String(row[9]).toLowerCase().includes(query)); // Buscar en columna J (índice 9)

  if (result) {
    showResultModal(result, headers);
  } else {
    alert("No se encontraron resultados.");
  }
}

// Mostrar resultados en un modal
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

  const content = fields
    .map(field => {
      let value = row[field.index] || "N/A";
      if (field.isDate) value = formatDate(value);
      return `<p><strong>${headers[field.index]}:</strong> ${value}</p>`;
    })
    .join("");

  const estadoExpediente = String(row[22] || "").toUpperCase();
  const indicador = estadoExpediente.includes("NO")
    ? `<div class="indicador-no-apto">No apto para trabajar</div>`
    : "";

  document.getElementById("modalContent").innerHTML = content + indicador;
  document.getElementById("modal").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// Cerrar modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

// Cargar datos al inicio
(async function () {
  expedienteData = await loadFromDatabase();
  if (expedienteData.length) {
    console.log("Datos cargados desde IndexedDB.");
  }
})();

// Hacer accesibles las funciones globalmente
window.searchExpediente = searchExpediente;
window.closeModal = closeModal;
