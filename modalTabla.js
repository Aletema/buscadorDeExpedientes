// Función para mostrar resultados en el modal
function showResultModal(row, headers) {
    const fields = [{
            title: "N° PM",
            index: 0
        },
        {
            title: "Nombre",
            index: 1
        },
        {
            title: "FECHA PRESENTACION DJP",
            index: 12,
            isDate: true
        },
        {
            title: "Infracciones",
            index: 15
        },
        {
            title: "N° de Expediente",
            index: 16
        },
        {
            title: "Nombre del expediente",
            index: 17
        },
        {
            title: "Mineral",
            index: 18
        },
        {
            title: "Vencimiento DJA",
            index: 20,
            isDate: true
        },
        {
            title: "Titular",
            index: 22
        },
        {
            title: "Estado legal",
            index: 24
        },
        {
            title: "Estado del expediente",
            index: 29
        },
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
    const estadoExpediente = String(row[29] || "").toUpperCase(); // Convertir a mayúsculas para evitar problemas de case
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
    return parsedDate.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Mostrar resultados en formato tabla
function showResultsTable(rows, headers, fields) {
    // Obtener el N° de PM y el Nombre de PM del primer resultado
    const numeroPM = rows[0][0] || "N/A"; // N° PM (Columna A)
    const nombrePM = rows[0][1] || "N/A"; // Nombre de PM (Columna B)

    // Crear el título (fuera de la tabla)
    const tituloPM = `
        <div style="text-align: center; margin-bottom: 10px; font-weight: bold;">
            N° PM: ${numeroPM} - Nombre de PM: ${nombrePM}
        </div>`;

    // Crear la tabla con las columnas seleccionadas
    let table = `<table border="1" style="width: 100%; text-align: left; border-collapse: collapse;">
                    <thead>
                      <tr>
                        <th>N° de Expediente</th>
                        <th>Nombre de Expediente</th>
                        <th>Mineral</th>
                        <th>Estado Expediente</th>
                      </tr>
                    </thead>
                    <tbody>`;

    rows.forEach(row => {
        table += `<tr>
                      <td>${row[16] || "N/A"}</td> <!-- N° de Expediente -->
                      <td>${row[17] || "N/A"}</td> <!-- Nombre de Expediente -->
                      <td>${row[18] || "N/A"}</td> <!-- Mineral -->
                      <td>${row[29] || "N/A"}</td> <!-- Estado Expediente -->
                  </tr>`;
    });

    table += `</tbody></table>`;

    // Mostrar el título y la tabla juntos en el modal
    document.getElementById("modalContent").innerHTML = tituloPM + table;
    document.getElementById("modal").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

