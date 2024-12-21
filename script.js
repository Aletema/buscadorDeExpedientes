// Reemplaza con el enlace a tu Google Sheet publicado como JSON
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbwtgOVBdtZqYI9Wd6ZFqhoFA8cWrq4MGmZEkhfyK-NszNhacSyJJy1tJ_wH3YYc3sPB/exec";

async function searchExpediente() {
  const query = document.getElementById("searchQuery").value.toLowerCase();
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Limpiar resultados previos

  if (!query) {
    resultsContainer.innerHTML = "<p>Por favor, ingresa un término de búsqueda.</p>";
    return;
  }

  try {
    // Obtener los datos de la API
    const response = await fetch(SHEET_API_URL);
    const data = await response.json();

    // Filtrar resultados
    const results = data.filter(row => 
      row.nombre.toLowerCase().includes(query) || 
      row.numero.toLowerCase().includes(query)
    );

    if (results.length > 0) {
      results.forEach(item => {
        const p = document.createElement("p");
        p.innerText = `Nombre: ${item.nombre} | Número: ${item.numero} | Detalles: ${item.detalle}`;
        resultsContainer.appendChild(p);
      });
    } else {
      resultsContainer.innerHTML = "<p>No se encontraron resultados.</p>";
    }
  } catch (error) {
    resultsContainer.innerHTML = "<p>Error al obtener datos. Por favor, inténtalo de nuevo más tarde.</p>";
    console.error("Error al obtener datos:", error);
  }
}
