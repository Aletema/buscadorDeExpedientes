// Buscar por N° de expediente
function buscarExpediente() {
    const query = document.getElementById("searchQuery").value.trim().toLowerCase();

    if (!query) {
        Swal.fire({
            title: "Error",
            text: "Por favor, ingrese un número de expediente para buscar.",
            icon: "warning",
            confirmButtonText: "Aceptar",
        });
        return;
    }

    const headers = expedienteData[1]; // Fila de encabezados
    const rows = expedienteData.slice(2); // Datos reales (desde la fila 2)

    // Filtrar resultados por coincidencia en la columna del número de expediente (columna Q)
    const result = rows.find(row => String(row[17] || "").toLowerCase().includes(query));

    if (result) {
        // Llamar a la función showResultModal con el resultado encontrado
        showResultModal(result, headers);
    } else {
        Swal.fire({
            title: "Sin resultados",
            text: "No se encontraron resultados para el número de expediente ingresado.",
            icon: "info",
            confirmButtonText: "Aceptar",
        });
    }
}


// Buscar por nombre de expediente
function buscarNombreExpediente() {
    const query = document.getElementById("searchQuery").value.trim().toLowerCase();

    if (!query) {
        Swal.fire({
            title: "Error",
            text: "Por favor, ingrese un nombre de expediente para buscar.",
            icon: "warning",
            confirmButtonText: "Aceptar",
        });
        return;
    }

    const headers = expedienteData[1]; // Fila de encabezados
    const rows = expedienteData.slice(2); // Datos reales (desde la fila 2)

    // Buscar el primer resultado que coincida con el nombre del expediente (columna R)
    const result = rows.find(row => String(row[18] || "").toLowerCase().includes(query));

    if (result) {
        // Llamar a la función showResultModal con el resultado encontrado
        showResultModal(result, headers);
    } else {
        Swal.fire({
            title: "Sin resultados",
            text: "No se encontraron resultados para el nombre de expediente ingresado.",
            icon: "info",
            confirmButtonText: "Aceptar",
        });
    }
}


// Buscar por N° de PM
function buscarNumeroPM() {
    const query = document.getElementById("searchQuery").value.trim().toLowerCase();

    if (!query) {
        Swal.fire({
            title: "Error",
            text: "Por favor, ingrese un número de PM para buscar.",
            icon: "warning",
            confirmButtonText: "Aceptar",
        });
        return;
    }

    const headers = expedienteData[1];
    const rows = expedienteData.slice(2);

    const results = rows.filter(row => String(row[0] || "").toLowerCase() === query);

    if (results.length > 0) {
        showResultsTable(results, headers, ["N° PM", "Nombre de PM", "N° de Expediente", "Nombre de Expediente", "Mineral"]);
    } else {
        Swal.fire({
            title: "Sin resultados",
            text: "No se encontraron resultados para el N° de PM ingresado.",
            icon: "info",
            confirmButtonText: "Aceptar",
        });
    }
}

// Buscar por nombre de PM
function buscarNombrePM() {
    const query = document.getElementById("searchQuery").value.trim().toLowerCase();

    if (!query) {
        Swal.fire({
            title: "Error",
            text: "Por favor, ingrese un nombre de PM para buscar.",
            icon: "warning",
            confirmButtonText: "Aceptar",
        });
        return;
    }

    const headers = expedienteData[1];
    const rows = expedienteData.slice(2);

    const results = rows.filter(row => String(row[1] || "").toLowerCase().includes(query));

    if (results.length > 0) {
        showResultsTable(results, headers, ["N° PM", "Nombre de PM", "N° de Expediente", "Nombre de Expediente", "Mineral"]);
    } else {
        Swal.fire({
            title: "Sin resultados",
            text: "No se encontraron resultados para el nombre de PM ingresado.",
            icon: "info",
            confirmButtonText: "Aceptar",
        });
    }
}

// función de búsqueda principal
function searchExpediente() {
    const searchType = document.getElementById("searchType").value;

    switch (searchType) {
        case "expediente":
            buscarExpediente();
            break;
        case "nombre":
            buscarNombreExpediente();
            break;
        case "numeroPM":
            buscarNumeroPM();
            break;
        case "nombrePM":
            buscarNombrePM();
            break;
        default:
            Swal.fire({
                title: "Error",
                text: "Por favor, seleccione un criterio de búsqueda válido.",
                icon: "warning",
                confirmButtonText: "Aceptar",
            });
            break;
    }
}