// Variable global para almacenar los datos del expediente
let expedienteData = [];

// ID de la hoja de Google Sheets y clave de API
const apiKey = "AIzaSyAo_EiLMzVXYd-C0A8-9MzCkrYDBL6bwzI"; // API Key válida
const sheetId = "13_N-JkdVvl3Tu5txTu9qR2xXpSVWzhqowhLn-JWUCKc"; // ID de la hoja de calculo en donde estan los datos
const range = "RegistroProvincialdePM"; // Nombre de la hoja de calculo

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

// Cargar datos automáticamente al inicio
(async function () {
    await loadFromGoogleSheets();
    if (expedienteData.length) {
        console.log("Datos cargados correctamente.");
    } else {
        console.log("No se encontraron datos.");
    }
})();
