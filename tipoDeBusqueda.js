// Variable global para almacenar el tipo de búsqueda seleccionado
let searchType = "expediente"; // Valor predeterminado

// Función para actualizar el tipo de búsqueda cuando se selecciona un botón
function setSearchType(type) {
    searchType = type; // Actualizar el tipo de búsqueda
    document.getElementById("searchQuery").placeholder = getPlaceholder(type); // Actualizar el placeholder
}

// Función para obtener el placeholder según el tipo de búsqueda
function getPlaceholder(type) {
    switch (type) {
        case "expediente":
            return "Ingrese el número de expediente...";
        case "nombre":
            return "Ingrese el nombre del expediente...";
        case "numeroPM":
            return "Ingrese el N° de PM...";
        case "nombrePM":
            return "Ingrese el nombre de PM...";
        default:
            return "Ingrese el valor a buscar...";
    }
}

// Función para ejecutar la búsqueda según el tipo seleccionado
function performSearch() {
    const query = document.getElementById("searchQuery").value.trim();
    if (!query) {
        Swal.fire({
            title: "Error",
            text: "Por favor, ingrese un valor para buscar.",
            icon: "warning",
            confirmButtonText: "Aceptar",
        });
        return;
    }

    // Llamar a la función correspondiente
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
            console.error("Tipo de búsqueda desconocido:", searchType);
    }
}
